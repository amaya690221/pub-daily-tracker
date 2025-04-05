// /src/components/Report.tsx

import { Grid2, Paper } from "@mui/material";
import MonthSelector from "../components/MonthSelector";
import CategoryChart from "../components/CategoryChart";
import BarChart from "../components/BarChart";
import TrackerTable from "../components/TrackerTable";
import { CategoriesData, Log } from "../types";
import { calculations, formatLogs } from "../utils/calculations";

type Props = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  monthlyLogs: Log[];
  categories: CategoriesData;
  isLoading: boolean;
  deleteLogsData: (ids: string | string[]) => Promise<null | undefined>;
};

const Report = ({
  currentMonth,
  setCurrentMonth,
  monthlyLogs,
  categories,
  isLoading,
  deleteLogsData,
}: Props) => {
  const paperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  //月のデータを日別に集計
  const monthlyTotal = calculations(monthlyLogs, categories);
  console.log("Report用monthlyTotal", monthlyTotal);

  //月のカテゴリとタイプの日別の集計
  const monthlyEvent = formatLogs(monthlyLogs, categories);
  console.log("Report用monthlyEvent", monthlyEvent);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined" sx={paperStyle}>
          <CategoryChart
            monthlyEvent={monthlyEvent}
            categories={categories}
            isLoading={isLoading}
          />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper variant="outlined" sx={paperStyle}>
          <BarChart monthlyTotal={monthlyTotal} isLoading={isLoading} />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TrackerTable
          monthlyTotal={monthlyTotal}
          monthlyEvent={monthlyEvent}
          monthlyLogs={monthlyLogs}
          deleteLogsData={deleteLogsData} //props追加
        />
      </Grid2>
    </Grid2>
  );
};

export default Report;
