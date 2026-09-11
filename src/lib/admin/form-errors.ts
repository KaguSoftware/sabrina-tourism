"use client";

/**
 * Helpers that turn a react-hook-form error object into something the admin
 * can act on: which tab holds the problem, which input to jump to, and what to
 * say in the toast.
 *
 * Before this existed, submitting an incomplete editor did nothing visible —
 * `handleSubmit` swallowed the invalid submit, the save never reached the
 * server, and the admin walked away believing the tour had been created.
 */

import type { FieldErrors } from "react-hook-form";

export interface FlatFieldError {
  /** Dotted form path, e.g. `tiers.0.tier_name`. */
  path: string;
  message: string;
  /** Editor tab holding the field, once resolved through a field→tab map. */
  tab?: string;
}

/**
 * Collects every leaf `message` in a nested react-hook-form error object,
 * keeping the dotted path that produced it.
 */
export function flattenFieldErrors(errors: FieldErrors | undefined, prefix = ""): FlatFieldError[] {
  const out: FlatFieldError[] = [];
  if (!errors || typeof errors !== "object") return out;
  for (const key of Object.keys(errors as Record<string, unknown>)) {
    const node = (errors as Record<string, unknown>)[key];
    if (!node || typeof node !== "object") continue;
    // Field arrays hang their array-level error off `root`; report it as the
    // array itself so it maps to a tab and scrolls to the list container.
    const path = key === "root" && prefix ? prefix : prefix ? `${prefix}.${key}` : key;
    const message = (node as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      out.push({ path, message });
    } else {
      out.push(...flattenFieldErrors(node as FieldErrors, path));
    }
  }
  return out;
}

/** The first segment of a dotted path — `tiers.0.tier_name` → `tiers`. */
export function rootField(path: string): string {
  return path.split(".")[0] ?? path;
}

/** Reads the message stored at a dotted path, if any. */
export function errorMessageAtPath(errors: unknown, path: string): string | undefined {
  let node: unknown = errors;
  for (const segment of path.split(".")) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[segment];
  }
  if (!node || typeof node !== "object") return undefined;
  const message = (node as { message?: unknown }).message;
  if (typeof message === "string" && message.length > 0) return message;
  // Field-array errors keep the array-level message under `root`.
  const root = (node as { root?: { message?: unknown } }).root;
  if (root && typeof root.message === "string" && root.message.length > 0) return root.message;
  return undefined;
}

/**
 * Finds the DOM node for a form path. Registered inputs carry `name`; anything
 * driven by `setValue` (date pickers, tag lists, galleries) opts in with
 * `data-field`. Falls back to progressively shorter paths so an error on
 * `dates.0.start_date` can still land on the `dates` block.
 */
export function findFieldElement(path: string): HTMLElement | null {
  const segments = path.split(".");
  for (let i = segments.length; i > 0; i--) {
    const candidate = segments.slice(0, i).join(".");
    const selector = `[name="${CSS.escape(candidate)}"], [data-field="${CSS.escape(candidate)}"]`;
    const el = document.querySelector<HTMLElement>(selector);
    if (el) return el;
  }
  return null;
}

/** Scrolls a field into view and focuses it when it can take focus. */
export function revealField(path: string): boolean {
  const el = findFieldElement(path);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusable = el.matches("input, select, textarea, button, [tabindex]")
    ? el
    : el.querySelector<HTMLElement>("input, select, textarea, button, [tabindex]");
  focusable?.focus({ preventScroll: true });
  return true;
}

/**
 * Opens the tab holding `path` (if it isn't already open) and scrolls the field
 * into view once that tab has painted.
 */
export function jumpToField<TTab extends string>({
  path,
  fieldToTab,
  currentTab,
  setTab,
}: {
  path: string;
  fieldToTab: Readonly<Record<string, TTab>>;
  currentTab: TTab;
  setTab: (tab: TTab) => void;
}): void {
  const targetTab = fieldToTab[rootField(path)];
  if (targetTab && targetTab !== currentTab) setTab(targetTab);
  // Two frames: one for the tab swap to commit, one for layout to settle.
  requestAnimationFrame(() => requestAnimationFrame(() => revealField(path)));
}

/** Tags each error with the tab that owns it, for callouts and toasts. */
export function withTabs<TTab extends string>(
  issues: FlatFieldError[],
  fieldToTab: Readonly<Record<string, TTab>>,
): FlatFieldError[] {
  return issues.map((issue) => ({ ...issue, tab: fieldToTab[rootField(issue.path)] }));
}

/**
 * Runs after a blocked submit: switches to the tab holding the first problem,
 * then scrolls that field into view once the tab has painted.
 *
 * Only one field is jumped to per attempt — saving again walks to the next one.
 * The full list comes back so the caller can show every outstanding issue at
 * once, letting the admin clear them in a single pass.
 */
export function revealFirstError<TTab extends string>({
  errors,
  fieldToTab,
  currentTab,
  setTab,
}: {
  errors: FieldErrors;
  fieldToTab: Readonly<Record<string, TTab>>;
  currentTab: TTab;
  setTab: (tab: TTab) => void;
}): FlatFieldError[] {
  const flat = withTabs(flattenFieldErrors(errors), fieldToTab);
  if (flat.length === 0) return flat;

  // Prefer an error on the tab already open — jumping away from what the admin
  // is looking at is disorienting when the field in front of them is at fault.
  const onCurrentTab = flat.find((e) => e.tab === currentTab);
  const target = onCurrentTab ?? flat[0]!;

  jumpToField({ path: target.path, fieldToTab, currentTab, setTab });

  return flat;
}
