import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CleaningFormService{
 getAllCleaningForm = async() => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms`);
 }
}
export default new CleaningFormService();