import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CleaningReportService {
  PostReport = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/Shifts/ByRoomId`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  getAllCleaningReportInfo = async () => {
    return axios.get(`${API_ENDPOINT}/api/CleaningReports/GetAllInfo`);
  }
}

export default new CleaningReportService();