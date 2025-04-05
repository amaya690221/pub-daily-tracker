// /src/components/MonthlySummary.tsx

import {
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { CategoriesData, Log } from "../types";
import { calculations } from "../utils/calculations";

type Props = {
  monthlyLogs: Log[];
  categories: CategoriesData;
};

const MonthlySummary = ({ monthlyLogs, categories }: Props) => {
  const theme = useTheme();

  const monthlyTotal = calculations(monthlyLogs, categories);
  console.log("monthlyTotal", monthlyTotal);

  return (
    <Grid2 container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* ポジティブ */}
      <Grid2 size={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: theme.palette.positiveColor.light,
            boxShadow: "none",
            border: `1px solid ${theme.palette.positiveColor.main}`,
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ThumbUpAltIcon
                sx={{
                  fontSize: "2rem",
                  color: theme.palette.positiveColor.dark,
                  marginRight: "5px",
                }}
              />
              <Typography>ポジティブ</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant={"h5"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {monthlyTotal.totalPositive}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      {/* ネガティブ */}
      <Grid2 size={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: theme.palette.negativeColor.light,
            boxShadow: "none",
            border: `1px solid ${theme.palette.negativeColor.main}`,
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ThumbDownAltIcon
                sx={{
                  fontSize: "2rem",
                  color: theme.palette.negativeColor.dark,
                  marginRight: "5px",
                }}
              />
              <Typography>ネガティブ</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant={"h5"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {monthlyTotal.totalNegative}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      {/* 記録した日数 */}
      <Grid2 size={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            bgcolor: theme.palette.daysColor.light,
            boxShadow: "none",
            border: `1px solid ${theme.palette.daysColor.main}`,
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <CalendarMonthIcon
                sx={{
                  fontSize: "2rem",
                  color: theme.palette.daysColor.dark,
                  marginRight: "5px",
                }}
              />
              <Typography>記録した日数</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant={"h5"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {monthlyTotal.totalDays}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default MonthlySummary;
