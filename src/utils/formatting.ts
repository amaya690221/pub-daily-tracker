// /src/utils/formatting.ts
// フォーマット用ユーティリティ
import { format } from "date-fns";

export const formatMonth = (date: Date): string => {
  return format(date, "yyyy-MM");
};

//16進数カラーをrgba形式に変換
export const formatColor = (hexColor: string, a: number) => {
  const r = parseInt(hexColor.slice(1, 3), 16); // 赤の16進数を10進数に変換
  const g = parseInt(hexColor.slice(3, 5), 16); // 緑の16進数を10進数に変換
  const b = parseInt(hexColor.slice(5, 7), 16); // 青の16進数を10進数に変換
  return `rgba(${r}, ${g}, ${b}, ${a})`; // 透明度をaに設定
};
