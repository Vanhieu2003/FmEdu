import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class GroupRoomService {

  createGroupRooms = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/GroupRooms`, data); 
  };


  getAllGroupRooms = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/GroupRooms`);
  }
}

export default new GroupRoomService();
