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

  getAllCriteria = async () => {
    return axios.get(`${API_ENDPOINT}/api/Criteria`);
  }

  getCriteriaByRoomIdMapByForm = async(roomId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Criteria/getCriteriaByRoom/${roomId}`)
  }
  
  getCriteriaByFormId = async (formId: string) => {
    return axios.get(`${API_ENDPOINT}/api/CriteriasPerForms/ByFormId/${formId}`);
  }

  postCriteria = async (data:object)=>{
    return axios.post(`${API_ENDPOINT}/api/Criteria/CreateCriteria`,data)
  }

}
export default new CriteriaService();