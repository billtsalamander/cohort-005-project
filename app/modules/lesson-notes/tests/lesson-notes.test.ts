import { describe, expect, it } from "vitest";
import { describeNoteDraft } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("describeNoteDraft", () => {
  it("counts characters against the note limit", () => {
    const draft = describeNoteDraft("hello", null);
    expect(draft.length).toBe(5);
    expect(draft.maxLength).toBe(MAX_NOTE_LENGTH);
  });

  it("can save new text when there is no saved note", () => {
    expect(describeNoteDraft("first thought", null)).toMatchObject({
      dirty: true,
      tooLong: false,
      canSave: true,
    });
  });

  it("treats an empty box with no saved note as unchanged", () => {
    expect(describeNoteDraft("", null).dirty).toBe(false);
  });

  it("cannot save text that matches the saved note", () => {
    expect(describeNoteDraft("same", "same")).toMatchObject({
      dirty: false,
      canSave: false,
    });
  });

  it("cannot save an empty or whitespace-only note", () => {
    expect(describeNoteDraft("", null).canSave).toBe(false);
    expect(describeNoteDraft("   \n", "old").canSave).toBe(false);
    expect(describeNoteDraft("   \n", "old").dirty).toBe(true);
  });

  it("treats a saved note with surrounding whitespace in the box as saved", () => {
    expect(describeNoteDraft("  same\n", "same")).toMatchObject({
      dirty: false,
      canSave: false,
    });
  });

  it("measures the trimmed text against the limit, as the server does", () => {
    const draft = describeNoteDraft(` ${"a".repeat(MAX_NOTE_LENGTH)} `, null);
    expect(draft.length).toBe(MAX_NOTE_LENGTH);
    expect(draft.tooLong).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("allows a note exactly at the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH), null);
    expect(draft.tooLong).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("refuses a note one character over the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH + 1), null);
    expect(draft.tooLong).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("treats an edited saved note as unsaved", () => {
    expect(describeNoteDraft("new text", "old text")).toMatchObject({
      dirty: true,
      canSave: true,
    });
  });
});
