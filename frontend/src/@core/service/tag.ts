import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class TagService{
 getAllTags = async() => {
    return axios.get(`${API_ENDPOINT}/api/Tags`);
 }

 getGroupInfoByTagId = async (id:string) =>{
  return axios.get(`${API_ENDPOINT}/api/Tags/GetGroupInfoByTagId/${id}`);
}

 getTagsByCriteriaId = async(criteriaId:string) =>{
   return axios.get(`${API_ENDPOINT}/api/TagsPerCriterias/Criteria/${criteriaId}`);
 }
 postTagsPerCriteria = async(data: { criteriaId: string|undefined, Tag: object[] }) =>{
   return axios.post(`${API_ENDPOINT}/api/TagsPerCriterias/newCriteria`, data);
 }
 getTagGroups =async()=>{
  return axios.get(`${API_ENDPOINT}/api/Tags/GetTagGroups`)
 }
}
export default new TagService();