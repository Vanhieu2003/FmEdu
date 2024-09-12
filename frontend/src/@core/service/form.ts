import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

type Form = {
   id?: string,
   formName: string,
   campusId: string,
   blockId: string,
   floorId: string,
   roomId: string,
   campusName?: string,
   blockName?: string,
   floorName?: string,
   roomName?: string
 };

export class CleaningFormService{
 getAllCleaningForm = async() => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms`);
 }
 postCleaningForm = async(form:Form) => {
    return axios.post(`${API_ENDPOINT}/api/CleaningForms`,form);
 }
 postCriteriaPerForm = async(data:any) => {
    return axios.post(`${API_ENDPOINT}/api/CriteriasPerForms/newForm`,data);
 }
 getFormById = async(formId:string) => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms/${formId}`);
 }
 EditCleaningForm = async(data:any) => {
    return axios.put(`${API_ENDPOINT}/api/CriteriasPerForms/edit`,data);
 }
}
export default new CleaningFormService();