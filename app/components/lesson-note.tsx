import { useState } from "react";
import { useFetcher } from "react-router";
import { NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { describeNoteDraft } from "~/modules/lesson-notes";

export function LessonNote({
  note,
}: {
  note: { body: string; updatedAt: string } | null;
}) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error;
  const draft = describeNoteDraft(body, note?.body ?? null);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <NoteHeader />
        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="What stood out in this lesson?"
            aria-label="Your notes"
            className="min-h-32 resize-y"
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !draft.canSave}
            >
              {isSaving ? "Saving..." : "Save note"}
            </Button>
            <NoteStatus
              error={error}
              dirty={draft.dirty}
              updatedAt={note?.updatedAt}
            />
            <NoteCounter
              length={draft.length}
              max={draft.maxLength}
              tooLong={draft.tooLong}
            />
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteStatus({
  error,
  dirty,
  updatedAt,
}: {
  error: string | undefined;
  dirty: boolean;
  updatedAt: string | undefined;
}) {
  if (error) return <span className="text-xs text-destructive">{error}</span>;
  if (dirty)
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  if (!updatedAt) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved {formatRelativeTime(updatedAt)}
    </span>
  );
}

function NoteHeader() {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Your notes</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Private to you. Jot things down while you watch.
      </p>
    </>
  );
}

function NoteCounter({
  length,
  max,
  tooLong,
}: {
  length: number;
  max: number;
  tooLong: boolean;
}) {
  return (
    <span
      className={cn(
        "ml-auto text-xs",
        tooLong ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {length} / {max}
    </span>
  );
}
