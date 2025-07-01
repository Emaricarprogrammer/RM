import axios from "axios";
const url = "https://academia-egaf-api.onrender.com/academia.egaf.ao"
const api = axios.create(({
    baseURL: url,
    withCredentials: true,
}))

export {api}