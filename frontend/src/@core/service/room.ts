import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class RoomService{
 getRoomsByFloorId = async(floorId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/Floor/${floorId}`);
 }
 getRoomById = async(roomId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/${roomId}`);
 }
 getRoomsByFloorIdIfExistForm = async(floorId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/IfExistForm/${floorId}`);
 }
 getAllRooms = async() => {
    return axios.get(`${API_ENDPOINT}/api/Rooms`);
 }
 searchRooms = async (input:string) => {
    return axios.get(`${API_ENDPOINT}/api/Rooms/SearchRoom/${input}`);
 }
 getRoomByBlockAndCampus = async (campusId:string,blockId:string) => {
   return axios.get(`${API_ENDPOINT}/api/Rooms/GetRoomByBlocksAndCampus?blockId=${blockId}&campusId=${campusId}`);
}
getRoomListByRoomType = async(roomType:string) => {
   return axios.get(`${API_ENDPOINT}/GetRoomsList/${roomType}`);
}
}

export default new RoomService();