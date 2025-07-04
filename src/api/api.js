import axios from "axios";
const url = "https://academia-egaf-api.onrender.com/academia.egaf.ao"
const videoApiUrl = "http://192.168.88.20:5350/academia.egaf.ao" 

const api = axios.create({
    baseURL: url,
    withCredentials: true,
})

const videoAPI = axios.create({
    baseURL: videoApiUrl,
    withCredentials: true,
})

export {api, videoAPI}