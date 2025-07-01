import axios from "axios";
const url = "http://192.168.88.20:5000/academia.egaf.ao"
const api = axios.create(({
    baseURL: url,
    withCredentials: true,
}))

export {api}