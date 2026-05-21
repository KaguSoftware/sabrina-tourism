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

export function toastWarning(message: string) {
  toast.warning(message);
}

export function toastInfo(message: string) {
  toast.info(message);
}
