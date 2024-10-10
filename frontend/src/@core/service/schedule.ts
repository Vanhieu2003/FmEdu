import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ScheduleService {
 
  createSchedule = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/Schedules`, data); 
  };

  getAllSchedule = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Schedules`);
  }
  
  
}

export default new ScheduleService();
