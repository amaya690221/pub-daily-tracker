// /src/components/DailySummary.tsx
import {
  Box,
  Card,
  CardContent,
  Grid2,
  Typography,
  useTheme,
} from "@mui/material";
import { CategoriesData, Log } from "../types";
import { calculations } from "../utils/calculations";

type Props = {
  dailyLogs: Log[];
  categories: CategoriesData;
};

const DailySummary = ({ dailyLogs, categories }: Props) => {
  const theme = useTheme();

  //選択日付の positve, negativeの総計算出
  const dailyTotal = calculations(dailyLogs, categories);
  console.log("dailyTotal", dailyTotal);

  return (
    <Box>
      <Grid2 container spacing={2}>
        {/* ポジティブ */}
        <Grid2 size={6} display={"flex"}>
          <Card
            sx={{
              bgcolor: theme.palette.grey[50],
              flexGrow: 1,
              boxShadow: "none",
              border: `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                ポジティブ
              </Typography>
              <Typography
                color={theme.palette.positiveColor.dark}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{
                  wordBreak: "break-all",
                }}
              >
                {dailyTotal && dailyTotal.totalPositive}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        {/* ネガティブ */}
        <Grid2 size={6} display={"flex"}>
          <Card
            sx={{
              bgcolor: theme.palette.grey[50],
              flexGrow: 1,
              boxShadow: "none",
              border: `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                ネガティブ
              </Typography>
              <Typography
                color={theme.palette.negativeColor.dark}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                {dailyTotal && dailyTotal.totalNegative}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};
export default DailySummary;
