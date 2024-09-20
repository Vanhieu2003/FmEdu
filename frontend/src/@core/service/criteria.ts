import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

type Criteria = {
  criteriaName: string;
  criteriaType: string;
  roomCategoryId: string;
  createAt: string;
  updateAt: string;
};


export class CriteriaService {
  getCriteriaByRoomCategoryId = async (roomCategoricalId: string) => {
    return axios.get(`${API_ENDPOINT}/api/Criteria/ByRoom/${roomCategoricalId}`);
  }
  
  getCriteriaByRoomId = async (roomId: string) => {
    return axios.get(`${API_ENDPOINT}/api/Criteria/ByRoomId/${roomId}`);
  }

 // Lấy tất cả tiêu chí và hỗ trợ phân trang
 getAllCriteria = async (pageNumber: number = 1, pageSize: number = 20) => {
  return axios.get(`${API_ENDPOINT}/api/Criteria`, {
    params: { pageNumber, pageSize }
  });
}

  getCriteriaByRoomIdMapByForm = async(roomId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Criteria/getCriteriaByRoom/${roomId}`)
  }
  
  getCriteriaByFormId = async (formId: string) => {
    return axios.get(`${API_ENDPOINT}/api/CriteriasPerForms/ByFormId/${formId}`);
  }

  getAllCriterias = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Criteria/Getall`)
  }

  postCriteria = async (data:object)=>{
    return axios.post(`${API_ENDPOINT}/api/Criteria/CreateCriteria`,data)
  }

}
export default new CriteriaService();