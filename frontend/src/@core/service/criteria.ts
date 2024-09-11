import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CriteriaService{
 getCriteriaByRoomCategoryId = async(roomCategoricalId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Criteria/ByRoom/${roomCategoricalId}`);
 }
}
export default new CriteriaService();