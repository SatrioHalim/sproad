import axios from "axios";
import session from "./session";

const network = axios.create({
    baseURL:"http://127.0.0.1:3030"
})

// buat nambahin token ke header setiap request
network.interceptors.request.use((config)=>{
    const token = session.getSession();

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
})

network.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if(error.response && error.response.status === 401){
        session.clearSession();

        // window.location.href = "/login";
    }

    return Promise.reject(error); // biar errornya tetep bisa di tangkep di component
})


export default network;