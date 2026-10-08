import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:4000/api',withCredentials:true});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&window.location.pathname!=='/login')window.dispatchEvent(new Event('vaultpay:unauthorized'));return Promise.reject(e)});
export default api;
