// /src/components/CategoryChart.tsx
//カテゴリグラフ(円グラフ)のコンポーネント
//雛形：https://react-chartjs-2-two.vercel.app/examples/pie-chart

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { CategoriesData, CategoriesItem } from "../types";
import {
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { mappingCategory } from "../utils/calculations";
import { formatColor } from "../utils/formatting";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  categories: CategoriesData;
  monthlyEvent: {
    start: string;
    positive: string[];
    negative: string[];
  }[];
  isLoading: boolean;
};

const CategoryChart = ({ monthlyEvent, categories, isLoading }: Props) => {
  const [selectedType, setSelectedType] =
    useState<CategoriesItem["type"]>("positive");
  const theme = useTheme();

  //選択したタイプ内のカテゴリの取得
  const filteredCategoryData = monthlyEvent.flatMap(
    (event) => event[selectedType]
  );
  console.log("filteredCategoryData", filteredCategoryData);

  //タイプ内のカテゴリの件数集計
  const categoryTotal = filteredCategoryData.reduce<Record<string, number>>(
    (acc, category: string) => {
      acc[category] = (acc[category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  //?? 0 を使うことで undefined になる可能性を排除。category: string の明示的な型付け。
  console.log("categoryTotal", categoryTotal);

  //カテゴリのラベルと値をそれぞれ配列に格納
  const categoryLabels = Object.keys(categoryTotal); //categoryTotalのkeyを配列に格納
  const categoryValues = Object.values(categoryTotal); //categoryTotalのvalueを配列に格納

  //カテゴリーマップの取得
  const categoryMap = mappingCategory(categories);

  //カテゴリーの色設定
  const categoryColor =
    selectedType === "positive"
      ? theme.palette.positiveCategoryColor
      : theme.palette.negativeCategoryColor;
  //{"red":"#123456","orange":"#234567"}
  console.log("categoryColor", categoryColor);

  // colorの配列を作成
  const colorValues = Object.values(categoryColor);

  // categoryMapと、colorValuesから、"カテゴリ名":"色"と言うオブジェクトを作成
  const nameColorMap = Object.entries(categoryMap)
    .filter(([_, map]) => map.type === selectedType) // type が一致するものを抽出
    .reduce((acc, [_, value], index) => {
      acc[value.name] = colorValues[index]; // name をキー、色を値に設定
      return acc;
    }, {} as Record<string, string>);

  console.log("nameColorMap", nameColorMap);

  // nameColorMapの各カテゴリの色名（#xxxxxx）を取得
  const getCategoryColor = (category: string) => {
    return nameColorMap[category]; // キーnameColorMap[category]の値を取得
  };

  const options = {
    maintainAspectRatio: false, //アスペクト比の固定を解除
    responsive: true,
  };

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: "# of Votes",
        data: categoryValues,

        backgroundColor: categoryLabels.map((category) => {
          const color = getCategoryColor(category);
          return formatColor(color, 0.2);
        }),

        borderColor: categoryLabels.map((category) => {
          const color = getCategoryColor(category);
          return formatColor(color, 1);
        }),
        borderWidth: 1,
      },
    ],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedType(e.target.value as CategoriesItem["type"]); //型アサーション
  };

  return (
    <>
      <TextField
        label="カテゴリの種類"
        select
        fullWidth
        value={selectedType}
        onChange={handleChange}
      >
        <MenuItem value="positive">ポジティブ</MenuItem>
        <MenuItem value="negative">ネガティブ</MenuItem>
      </TextField>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexGrow={1}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyEvent.length > 0 ? (
          <Pie options={options} data={data} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
