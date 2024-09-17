import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ShiftService{
 getShiftsByRoomCategoricalId = async(roomCategoricalId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Shifts/ByRoomId/${roomCategoricalId}`);
 }
 getAllShifts = async() => {
  return axios.get(`${API_ENDPOINT}/api/Shifts`);
 }
}
export default new ShiftService();