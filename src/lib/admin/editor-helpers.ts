"use client";

/**
 * Shared helper utilities for admin editor components.
 * Used by PackageEditor, DailyEditor, and PremadeEditor.
 */

import { useEffect } from "react";

// ---------------------------------------------------------------------------
// collectErrors
// ---------------------------------------------------------------------------

/**
 * Traverses a nested react-hook-form error object and collects all leaf
 * `message` strings into a flat array.
 */
export function collectErrors(errs: Record<string, unknown>): string[] {
  const msgs: string[] = [];
  function walk(obj: unknown) {
    if (!obj || typeof obj !== "object") return;
    const o = obj as Record<string, unknown>;
    if (typeof o.message === "string") {
      msgs.push(o.message);
      return;
    }
    for (const k of Object.keys(o)) walk(o[k]);
  }
  walk(errs);
  return msgs;
}

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

/**
 * Formats a Date as a human-readable relative string such as
 * "just now", "3 minutes ago", "2 hours ago", or "1 day ago".
 */
export function formatRelativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? "" : "s"} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? "" : "s"} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? "" : "s"} ago`;
}

// ---------------------------------------------------------------------------
// useDirtyBeforeUnload
// ---------------------------------------------------------------------------

/**
 * Registers a `beforeunload` event handler that prevents navigation when
 * the form has unsaved changes (`isDirty === true`).
 *
 * Must be called inside a React component or custom hook.
 */
export function useDirtyBeforeUnload(isDirty: boolean): void {
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
