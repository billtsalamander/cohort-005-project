import { describeDraft, type NoteDraft } from "./lib/draft";

export type { NoteDraft };

/**
 * What the note editor shows about the text in the box: the character
 * count against the limit, whether it differs from the saved note, and
 * whether Save would be accepted.
 */
export function describeNoteDraft(
  draft: string,
  savedBody: string | null
): NoteDraft {
  return describeDraft(draft, savedBody ?? "");
}
