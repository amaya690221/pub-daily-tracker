// /src/validations/schema.ts
// Zodのスキーマ定義ファイル

import { z } from "zod";

export const trackerSchema = z.object({
  date: z.string().min(1, { message: "日付は必須です" }),
  category: z
    .array(z.string())
    .min(1, { message: "一つ以上、選択肢を選択してください" }),
  memo: z.string().max(1000, { message: "1000文字以内にしてください" }),
});

export type Schema = z.infer<typeof trackerSchema>;
