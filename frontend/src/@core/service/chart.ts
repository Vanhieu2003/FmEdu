import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ChartService {
  GetAverageValueForReport = async(campusId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByYear/${campusId}`)
  }

  GetAverageValueForCriteriaPerCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetCriteriaValuesByCampus/${campusId}`
    );
  };

  GetCleaningReportCount = async () => {
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportCount`);
  }

  GetTotalReportPerDayCount = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetReportInADay`)
  }

  GetCleaningReportByYear = async(campusId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByMonth/${campusId}`)
  }
}

export default new ChartService();