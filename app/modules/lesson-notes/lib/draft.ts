import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraft = {
  length: number;
  maxLength: number;
  tooLong: boolean;
  dirty: boolean;
  canSave: boolean;
};

export function describeDraft(draft: string, savedBody: string): NoteDraft {
  const tooLong = draft.length > MAX_NOTE_LENGTH;
  const empty = draft.trim().length === 0;
  const dirty = draft !== savedBody;
  return {
    length: draft.length,
    maxLength: MAX_NOTE_LENGTH,
    tooLong,
    dirty,
    // The save action rejects an empty note, so the button does too.
    canSave: dirty && !empty && !tooLong,
  };
}
