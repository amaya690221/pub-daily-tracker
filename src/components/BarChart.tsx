// /src/components/BarChart.tsx
//縦型棒グラフのコンポーネント
//雛形：https://react-chartjs-2-two.vercel.app/examples/vertical-bar-chart

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";
import { formatColor } from "../utils/formatting";
import { Box, CircularProgress, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//propsの型定義
type Props = {
  monthlyTotal: {
    logs: {
      id: string;
      date: string;
      positive: number;
      negative: number;
    }[];
    totalPositive: number;
    totalNegative: number;
    totalDays: number;
  };
  isLoading: boolean;
};

//propsの定義
const BarChart = ({ monthlyTotal, isLoading }: Props) => {
  const theme = useTheme();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "日別データ",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // 日付をキーに日毎のデータを加工
  const logsByDate = monthlyTotal.logs.reduce((acc, log) => {
    //reduceで、dateをキーにデータ加工
    acc[log.date] = {
      id: log.id,
      positive: log.positive,
      negative: log.negative,
    };
    return acc;
  }, {} as Record<string, { id: string; positive: number; negative: number }>);
  console.log("logsByDate", logsByDate);

  //labels用配列生成
  const dateLabels = Object.keys(logsByDate).sort();
  console.log("BarChar用dateLabels", dateLabels);

  //positiveデータ用配列生成、dateLabelsをキーにlogsByDateより取得
  const positiveData = dateLabels.map(
    (day) => logsByDate?.[day]?.positive ?? 0
  );
  console.log("BarChar用positiveData", positiveData);

  //negativeデータ用配列生成、dateLabelsをキーにlogsByDateより取得
  const negativeData = dateLabels.map(
    (day) => logsByDate?.[day]?.negative ?? 0
  );
  console.log("BarChar用negativeData", negativeData);

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "ポジティブ",
        data: positiveData,
        backgroundColor: formatColor(theme.palette.positiveColor.dark, 0.5),
      },
      {
        label: "ネガティブ",
        data: negativeData,
        backgroundColor: formatColor(theme.palette.negativeColor.dark, 0.5),
      },
    ],
  };
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexGrow={1}
    >
      {isLoading ? (
        <CircularProgress />
      ) : monthlyTotal.logs.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;
