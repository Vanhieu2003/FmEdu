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

  getAllCriteria = async () => {
    return axios.get(`${API_ENDPOINT}/api/Criteria`);
  }

  postCriteria = async (criteria: Criteria): Promise<Criteria> => {
    try {
      const response = await axios.post<Criteria>(`${API_ENDPOINT}/api/Criteria`, criteria);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo tiêu chí:', error);
      throw error;
    }
  }

}
export default new CriteriaService();