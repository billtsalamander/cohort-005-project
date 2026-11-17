import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraft = {
  length: number;
  maxLength: number;
  tooLong: boolean;
  dirty: boolean;
  canSave: boolean;
};

/**
 * What the note editor shows about the text in the box: the character
 * count against the limit, whether it differs from the saved note, and
 * whether Save would be accepted.
 */
export function describeNoteDraft(
  draft: string,
  savedBody: string | null
): NoteDraft {
  // The save action trims the body before it checks and stores it, so the
  // editor measures and compares the trimmed text too.
  const trimmed = draft.trim();
  const tooLong = trimmed.length > MAX_NOTE_LENGTH;
  const dirty = trimmed !== (savedBody ?? "");
  return {
    length: trimmed.length,
    maxLength: MAX_NOTE_LENGTH,
    tooLong,
    dirty,
    // The save action rejects an empty note, so the button does too.
    canSave: dirty && trimmed.length > 0 && !tooLong,
  };
}
