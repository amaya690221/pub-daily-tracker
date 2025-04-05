// /src/types/index.ts
// 型定義ファイル

/*** Firestoreの型定義 ***/
//categories用、配列内の個々のオブジェクト型
export type CategoriesItem = {
    id: number;
    category: string;
    type: "positive" | "negative";
  };
  
  //categories用、セットのデータ型
  export type CategoriesData = {
    data: CategoriesItem[]; // 配列データ
  };
  
  //categories用、Firestoreコレクション全体の型（複数セット/ユーザー分）
  export type CategoriesDataCollection = CategoriesData[];
  
  //log用
  export type Log = {
    id: string;
    categoryIds: number[];
    date: string;
    memo?: string;
  };
  