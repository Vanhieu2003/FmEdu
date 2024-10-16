import { CurrentAction, ScheduleComponent } from "@syncfusion/ej2-react-schedule";
import { useCallback } from "react";
import { User } from "../type/Type";

interface CalendarItem {
    id: string;
    groupName: string;
    color: string;
    isChecked: boolean;
  }

export const getResponsibleGroupText = (id: string,calendars:CalendarItem[]) => {
    const calendar = calendars.find(cal => cal.id === id);
    return calendar ? calendar.groupName : 'Không xác định';
  };

export const userMapping = (userList:any)=>{
  const users = userList.map((user:User)=>({
    text: `${user.firstName} ${user.lastName}`,
    id: user.id
  }))
  return users;
}
