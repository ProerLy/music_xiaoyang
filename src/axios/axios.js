// 引入axios
import axios from 'axios'
// 引入getData
import {getData as _get} from "@/assets/js";
// 创建axios
const http = axios.create({
    baseURL: 'http://localhost:81/music_qyx/api',
    timeout: 5000
})

// 请求拦截器
http.interceptors.request.use(config=>{
    // 在发起请求之前
    // config.url   （当前请求的url）
    // 需要携带token 每个请求请求头需要携带token
    // if(config.url !== '/login_control.php'){
    //     // console.log(config.url);
    //     config.headers["Authorization"] = _get('token');
    // }
    return config;
},error => {
    // 抛出错误
    return Promise.reject(error);
})

// 响应拦截器
http.interceptors.response.use(res=>{
    // 在响应之前
    return res;
},error => {
    // 抛出错误
    return Promise.reject(error);
})

export default http;
