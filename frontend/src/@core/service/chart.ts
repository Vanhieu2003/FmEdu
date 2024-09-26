import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ChartService {
  GetAverageValueForReport = async(campusId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/average-values?campusId=${campusId}`)
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

  GetCleaningReportByYear = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByYear`)
  }
  GetCleaningReportByQuarter = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByQuarter`)
  }
  GetCleaningReportBySixMonth = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsBy6Months`)
  }
}

export default new ChartService();