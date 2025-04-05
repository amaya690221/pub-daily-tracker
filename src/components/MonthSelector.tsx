// /src/components/MonthSelector.tsx
//Reportで日付を選択するコンポーネント

import { Box, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { addMonths } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
};

const MonthSelector = ({ currentMonth, setCurrentMonth }: Props) => {
  //DatePickerで選択した日付の反映
  const handleDateChange = (newDate: Date | null) => {
    // console.log("handleDateChange", newDate);
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };

  //先月にセットする処理
  const handlePrevMonth = () => {
    const prevMonth = addMonths(currentMonth, -1);
    setCurrentMonth(prevMonth);
  };

  //次月にセットする処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          onClick={handlePrevMonth}
          sx={{
            color: "white",
            boxShadow: "none",
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#151e27",
            },
          }}
        >
          先月
        </Button>
        <DatePicker
          onChange={handleDateChange}
          value={currentMonth}
          sx={{
            mx: 2,
            background: "white",
          }}
          label={"年月を選択"}
          views={["year", "month"]}
          format="yyyy/MM"
        />
        <Button
          onClick={handleNextMonth}
          sx={{
            color: "white",
            boxShadow: "none",
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#151e27",
            },
          }}
        >
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
