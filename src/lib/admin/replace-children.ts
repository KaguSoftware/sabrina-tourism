/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Replaces every child row belonging to a parent record.
 *
 * The obvious implementation — delete, then insert — commits the delete first,
 * so a failing insert leaves the parent stripped of its children while the
 * caller happily reports success. Instead we note the existing row ids, insert
 * the replacements, and only remove the old rows once the insert has landed.
 * A failure at any stage leaves the previous rows untouched and is reported to
 * the caller, so the editor can surface it instead of showing "Saved".
 *
 * None of these child tables carry unique constraints, so the old and new rows
 * can coexist for the moment between the insert and the delete.
 */
export async function replaceChildren(
  supabase: any,
  table: string,
  parentColumn: string,
  parentId: string,
  rows: Record<string, unknown>[],
  label: string,
): Promise<{ error?: string }> {
  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("id")
    .eq(parentColumn, parentId);
  if (readError) return { error: `${label} could not be read: ${readError.message}` };

  if (rows.length) {
    const { error: insertError } = await supabase.from(table).insert(rows);
    if (insertError) return { error: `${label} could not be saved: ${insertError.message}` };
  }

  const oldIds = (existing ?? []).map((r: { id: string }) => r.id);
  if (oldIds.length) {
    const { error: deleteError } = await supabase.from(table).delete().in("id", oldIds);
    if (deleteError) return { error: `${label} could not be replaced: ${deleteError.message}` };
  }

  return {};
}
