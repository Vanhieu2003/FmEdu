import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ScheduleService {
 
  createSchedule = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/Schedules`, data); 
  };

  getAllSchedule = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Schedules`);
  }
  getTagAndUserByShiftAndRoom = async (shiftId:string, roomId:string, criteriaIds:string[]) => {
    const criteriaParams = criteriaIds.map(id => `criteriaIds=${id}`).join('&');
    const url = `${API_ENDPOINT}/api/Schedules/get-users-by-shift-room-and-criteria?shiftId=${shiftId}&roomId=${roomId}&${criteriaParams}`;
    return axios.get(url);
  }
  deleteSchedule = async (id: string) => {
    return axios.delete(`${API_ENDPOINT}/api/Schedules/${id}`);
  }
}

export default new ScheduleService();
