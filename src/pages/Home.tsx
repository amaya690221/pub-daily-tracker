// /src/components/Home.tsx

import { Box, useMediaQuery, useTheme } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import TrackerMenu from "../components/TrackerMenu";
import TrackerForm from "../components/TrackerForm";
import { CategoriesData, Log } from "../types";
import { useState } from "react";
import { format } from "date-fns";
import { Schema } from "../validations/schema";
import { DateClickArg } from "@fullcalendar/interaction/index.js";

type Props = {
  monthlyLogs: Log[];
  categories: CategoriesData;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  saveLogsData: (data: Schema) => Promise<null | undefined>;
  deleteLogsData: (ids: string | string[]) => Promise<null | undefined>;
  updateLogsData: (data: Schema, id: string) => Promise<null | undefined>;
};

const Home = ({
  monthlyLogs,
  categories,
  setCurrentMonth,
  saveLogsData,
  deleteLogsData,
  updateLogsData,
}: Props) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg")); //lgは1200px以下のサイズ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); //TrackeMenuの開閉用ステート、モバイル用
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false); //TrackerFormの開閉用ステート、モバイル用

  //日毎のlog抽出処理
  const dailyLogs = monthlyLogs.filter((log) => log.date === currentDay);
  // console.log("dailyLogs", dailyLogs);

  //フォームのクローズ処理
  const onCloseForm = () => {
    // setIsFormOpen(!isFormOpen);
    if (isMobile) {
      setIsMobileFormOpen(false);
    } else {
      setIsFormOpen(false);
    }
  };

  //フォームの開閉処理
  const handleAddForm = () => {
    // setIsFormOpen(!isFormOpen);
    if (isMobile) {
      setIsMobileFormOpen(!isMobileFormOpen);
    } else {
      setIsFormOpen(!isFormOpen);
    }
  };

  //メニューをクローズする処理、モバイル用
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  //日付クリック時の処理、Calendarより移植
  const handleDateClick = (dateInfo: DateClickArg) => {
    //DatesSetArg, dateClickの型情報より定義
    console.log("Date clicked!", dateInfo);
    setCurrentDay(dateInfo.dateStr); //console.logより確認したデータ構造に基づき指定
    setIsMobileMenuOpen(true); //モバイル用のメニューを開く、追加
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側のコンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        {/* 各コンポーネントを配置 */}
        <MonthlySummary monthlyLogs={monthlyLogs} categories={categories} />
        <Calendar
          monthlyLogs={monthlyLogs}
          categories={categories}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          handleDateClick={handleDateClick}
        />
      </Box>

      {/* 右側のコンテンツ */}
      <Box>
        {/* 各コンポーネントを配置 */}
        <TrackerMenu
          dailyLogs={dailyLogs}
          currentDay={currentDay}
          categories={categories}
          handleAddForm={handleAddForm}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          handleCloseMobileMenu={handleCloseMobileMenu}
        />
        <TrackerForm
          categories={categories}
          isFormOpen={isFormOpen}
          onCloseForm={onCloseForm}
          currentDay={currentDay}
          saveLogsData={saveLogsData}
          dailyLogs={dailyLogs}
          deleteLogsData={deleteLogsData}
          updateLogsData={updateLogsData}
          isMobile={isMobile}
          isMobileFormOpen={isMobileFormOpen}
          setIsMobileFormOpen={setIsMobileFormOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;
