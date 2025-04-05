// /src/utils/calculations.ts
// データ集計用関数

import { CategoriesData, Log } from "../types";

/*** categoriesから、カテゴリのIDをキーにしたマップ生成 ***/
export function mappingCategory(categories: CategoriesData) {
  const categoryMap: Record<
    number,
    { type: "positive" | "negative"; name: string }
  > = categories.data.reduce((acc, category) => {
    acc[category.id] = { type: category.type, name: category.category };
    return acc;
  }, {} as Record<number, { type: "positive" | "negative"; name: string }>);
  // console.log("categoryMap", categoryMap);
  return categoryMap;
}

/*** 月のポジティブ、ネガティブ、記録日数を集計 ***/
export function calculations(logs: Log[], categories: CategoriesData) {
  const totalDays = logs.length;

  const categoryMap = mappingCategory(categories);

  // 各ログの positive/negative カウントと全体の合計を算出
  let totalPositive = 0;
  let totalNegative = 0;

  const logCounts = logs.map((log) => {
    const counts = log.categoryIds.reduce(
      (acc, id) => {
        const type = categoryMap[id];
        if (type.type === "positive") acc.positive++;
        if (type.type === "negative") acc.negative++;
        return acc;
      },
      { positive: 0, negative: 0 }
    );

    // 総計に加算
    totalPositive += counts.positive;
    totalNegative += counts.negative;

    return {
      id: log.id,
      date: log.date,
      positive: counts.positive,
      negative: counts.negative,
    };
  });

  return {
    logs: logCounts,
    totalPositive,
    totalNegative,
    totalDays,
  };
}

/*** その日の、登録したカテゴリーを集計し表示するための関数***/
export function formatLogs(logs: Log[], categories: CategoriesData) {
  // カテゴリのIDをキーにしたマップを作成
  const categoryMap = mappingCategory(categories);

  // ログデータを変換
  const formattedLogs = logs.map((log) => {
    const start = log.date;

    // categoryIds を positive / negative に分類
    const { positive, negative } = log.categoryIds.reduce(
      (acc, id) => {
        const category = categoryMap[id];
        if (category) {
          if (category.type === "positive") acc.positive.push(category.name);
          if (category.type === "negative") acc.negative.push(category.name);
        }
        return acc;
      },
      { positive: [] as string[], negative: [] as string[] }
    );

    return { start, positive, negative };
  });

  return formattedLogs;
}
