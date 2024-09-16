import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CleaningReportService {
  PostReport = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/CleaningReports/create`, data);
  }
  getAllCleaningReportInfo = async () => {
    return axios.get(`${API_ENDPOINT}/api/CleaningReports/GetAllInfo`);
  }
  getCleaningReportById = async (id: string) => {
    return axios.get(`${API_ENDPOINT}/api/CleaningReports/GetFullInfo/${id}`);
  }
  updateCleaningReport = async (data: object) => {
    return axios.put(`${API_ENDPOINT}/api/CleaningReports/update`, data);
  }
}

export default new CleaningReportService();