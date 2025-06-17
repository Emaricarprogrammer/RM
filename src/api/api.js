import axios from "axios";
const url = "http://localhost:5000/academia.egaf.ao"
const api = axios.create(({
    baseURL: url,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
}))

export {api}