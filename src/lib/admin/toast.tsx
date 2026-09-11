import { toast } from "sonner";

function quote(name?: string | null) {
  const trimmed = (name ?? "").trim();
  return trimmed ? `"${trimmed}"` : "";
}

function joinWithName(prefix: string, kind: string, name?: string | null) {
  const q = quote(name);
  return q ? `${prefix} ${kind} ${q}` : `${prefix} ${kind}`;
}

export function toastSaved(kind: string, name?: string | null) {
  toast.success(joinWithName("Saved", kind.toLowerCase(), name));
}

export function toastCreated(kind: string, name?: string | null) {
  toast.success(joinWithName("Created", kind.toLowerCase(), name));
}

export function toastPublished(kind: string, name?: string | null) {
  const q = quote(name);
  toast.success(q ? `${q} is now live on the site` : `${kind} published`);
}

export function toastUnpublished(kind: string, name?: string | null) {
  const q = quote(name);
  toast.success(q ? `${q} hidden from the site` : `${kind} unpublished`);
}

export function toastDeleted(kind: string, name?: string | null) {
  toast.success(joinWithName("Deleted", kind.toLowerCase(), name));
}

export function toastDuplicated(kind: string, name?: string | null) {
  toast.success(joinWithName("Duplicated", kind.toLowerCase(), name));
}

export function toastReordered(kind: string) {
  toast.success(`${kind} order updated`);
}

export function toastError(action: string, reason?: string | null) {
  const detail = (reason ?? "").trim();
  toast.error(detail ? `Couldn't ${action} — ${detail}` : `Couldn't ${action}`);
}

/** How many issues the toast spells out before collapsing the rest into a count. */
const MAX_LISTED_ISSUES = 6;

/** Undoes the Toaster's uppercase mono styling so a list stays readable. */
const listStyle: React.CSSProperties = {
  textTransform: "none",
  letterSpacing: "normal",
  fontFamily: "var(--font-sans)",
  fontSize: "12.5px",
  lineHeight: 1.5,
};

/**
 * Shown when a save is blocked by client-side validation. Without it an invalid
 * submit produced no feedback at all — the form simply didn't post.
 *
 * The editor jumps to one field at a time, but the toast spells out every
 * outstanding issue so the admin can clear them all in one pass instead of
 * discovering them one failed save after another.
 */
export function toastValidationIssues(issues: Array<{ tab?: string; message: string }>) {
  if (issues.length === 0) return;

  if (issues.length === 1) {
    toast.error(`Can't save — ${issues[0]!.message}`, { duration: 6000 });
    return;
  }

  const listed = issues.slice(0, MAX_LISTED_ISSUES);
  const hidden = issues.length - listed.length;

  toast.error(`Can't save — ${issues.length} issues to fix`, {
    duration: 10000,
    description: (
      <div style={listStyle}>
        <ol style={{ margin: "6px 0 0", paddingLeft: 18, listStyleType: "decimal" }}>
          {listed.map((issue, i) => (
            <li key={`${issue.tab ?? ""}-${i}`} style={{ marginTop: 2 }}>
              {issue.tab ? <strong>{issue.tab}: </strong> : null}
              {issue.message}
            </li>
          ))}
        </ol>
        {hidden > 0 && (
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>+ {hidden} more</p>
        )}
        <p style={{ margin: "8px 0 0", opacity: 0.75 }}>
          Taking you to the first one — fix them all, or save again to jump to the next.
        </p>
      </div>
    ),
  });
}

export function toastWarning(message: string) {
  toast.warning(message);
}

export function toastInfo(message: string) {
  toast.info(message);
}
