import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class TagService{
 getAllTags = async() => {
    return axios.get(`${API_ENDPOINT}/api/Tags`);
 }

 getTagsByCriteriaId = async(criteriaId:string) =>{
   return axios.get(`${API_ENDPOINT}/api/TagsPerCriterias/Criteria/${criteriaId}`);
 }
 postTagsPerCriteria = async(data: { criteriaId: string|undefined, Tag: object[] }) =>{
   return axios.post(`${API_ENDPOINT}/api/TagsPerCriterias/newCriteria`, data);
 }
}
export default new TagService();