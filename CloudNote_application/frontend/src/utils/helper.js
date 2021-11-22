import axios from "axios";

export const backendURL = "";

export function getContributor(id){
  return axios.get(`${backendURL}/api/contributors?page_id=${id}`)
}

export function removeHTMLTags (str) {
  return str.replace(/<[^>]*>?/gm, '');
};