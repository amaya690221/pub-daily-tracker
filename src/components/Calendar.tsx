// /src/components/Calendar.tsx

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { formatLogs } from "../utils/calculations";
import { CategoriesData, Log } from "../types";
import { lightGreen } from "@mui/material/colors";
import { isSameMonth } from "date-fns";

type Props = {
  monthlyLogs: Log[];
  categories: CategoriesData;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  handleDateClick: (dateInfo: DateClickArg) => void;
};

const Calendar = ({
  monthlyLogs,
  categories,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  handleDateClick,
}: Props) => {
  const events = formatLogs(monthlyLogs, categories);
  // console.log("events", events);

  //選択した日の背景色をつける
  const backgroundEvent = {
    start: currentDay,
    backgroundColor: lightGreen[100],
    display: "background",
  };
  // console.log("events:", [...events, backgroundEvent]);

  //FullCalendarのイベント拡張オプションの定義
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        {eventInfo.event.extendedProps.positive?.map(
          (posi: string, index: number) => (
            <div className="category" id="event-positive" key={index}>
              {posi}
            </div>
          )
        )}
        {eventInfo.event.extendedProps.negative?.map(
          (nega: string, index: number) => (
            <div className="category" id="event-negative" key={index}>
              {nega}
            </div>
          )
        )}
      </div>
    );
  };

  //月を移動した際の処理
  const handleDateSet = (dateInfo: DatesSetArg) => {
    const currentMonth = dateInfo.view.currentStart; //console.logより確認したデータ構造に基づき指定
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      //isSameMonthは、date-fnsのメソッド、引数の月が同じかどうか比較
      setCurrentDay(today);
    }
  };

  // //日付をクリックした際の処理
  // const handleDateClick = (dateInfo: DateClickArg) => {
  //   //DatesSetArg, dateClickの型情報より定義
  //   // console.log("Date clicked!", dateInfo);
  //   setCurrentDay(dateInfo.dateStr); //console.logより確認したデータ構造に基づき指定
  // };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...events, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={handleDateClick}
    />
  );
};

export default Calendar;
