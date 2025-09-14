import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api",//"https://4tbfxkgz-3000.inc1.devtunnels.ms/api" ,
    withCredentials:true
});

export default api