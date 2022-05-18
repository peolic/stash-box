ALTER TABLE "edit_votes"
  ALTER COLUMN "user_id" DROP NOT NULL,

  DROP CONSTRAINT "edit_votes_edit_id_fkey",
  DROP CONSTRAINT "edit_votes_user_id_fkey",

  ADD CONSTRAINT "edit_votes_edit_id_fkey"
    FOREIGN KEY ("edit_id") REFERENCES "edits"("id") ON DELETE CASCADE,
  ADD CONSTRAINT "edit_votes_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
