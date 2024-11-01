import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ChartService {
  GetAverageValueForReport = async(campusId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/average-values?campusId=${campusId}`)
  }

  GetAverageValueForCriteriaPerCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetTopCriteriaValuesByCampus?campusId=${campusId}`
    );
  };

  GetBlockReports = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetBlockReports/${campusId}`
    );
  };

  GetCleaningReportBy10Days = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByLast10Days`)
  }
  GetCleaningReportByQuarter = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByQuarter`)
  }
  


  GetCleaningProgressByCampusId = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/summary?campusId=${campusId}`
    );
  }
  GetChartComparision = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/comparison`)
  }

  GetDailyTagAndUserByCampus = async(campusId:string)=>{
    return axios.get(
      `${API_ENDPOINT}/api/Chart/responsible-tag-report?campusId=${campusId}`
    );
  }

  GetDailyRoomGroupReportByCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/room-group-report?campusId=${campusId}`
    );
  }

  GetDailyReportStatusTableByCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/detail-report?campusId=${campusId}`
    );
  }
}

export default new ChartService();