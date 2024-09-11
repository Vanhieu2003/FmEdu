import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ShiftService{
 getShiftsByRoomCategoricalId = async(roomCategoricalId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Shifts/ByRoomId/${roomCategoricalId}`);
 }
}
export default new ShiftService();