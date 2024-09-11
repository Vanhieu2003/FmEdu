import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class FloorService{
 getFloorByBlockId = async(blockId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Floors/Block/${blockId}`);
 }
 getFloorById = async(floorId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Floors/${floorId}`);
 }
}
export default new FloorService();