import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class GroupRoomService {

  createGroupRooms = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/GroupRooms`, data); 
  };
  getRoomGroupById = async (id:string)=>{
    return axios.get(`${API_ENDPOINT}/api/GroupRooms/${id}`);
  }

  updateRoomGroup = async (id:string ,data:object)=>{
    return axios.put(`${API_ENDPOINT}/api/GroupRooms/${id}`,data);
  }

  getAllGroupRooms = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/GroupRooms`);
  }
}

export default new GroupRoomService();
