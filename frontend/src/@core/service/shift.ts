import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ShiftService{
 getShiftsByRoomCategoricalId = async(roomCategoricalId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Shifts/ByRoomId/${roomCategoricalId}`);
 }
 getAllShifts = async (pageNumber: number = 1, pageSize: number = 10) => {
  return axios.get(`${API_ENDPOINT}/api/Shifts`, {
   params: { pageNumber, pageSize }
 });
 }

 createShifts = async (data: object) => {
   return axios.post(`${API_ENDPOINT}/api/Shifts`, data); 
 };
 
 
}
export default new ShiftService();