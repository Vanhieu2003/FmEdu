import { CurrentAction, ScheduleComponent } from "@syncfusion/ej2-react-schedule";
import { useCallback } from "react";

interface CalendarItem {
    id: string;
    text: string;
    color: string;
    isChecked: boolean;
  }

export const getResponsibleGroupText = (id: string,calendars:CalendarItem[]) => {
    const calendar = calendars.find(cal => cal.id === id);
    return calendar ? calendar.text : 'Không xác định';
  };

