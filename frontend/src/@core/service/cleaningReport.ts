import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CleaningReportService {
    PostReport = async (data:object) => {
      return axios.post(`${API_ENDPOINT}/api/Shifts/ByRoomId`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  export default new CleaningReportService();