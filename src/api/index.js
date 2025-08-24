import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URL });

//Send request with authorization
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = (data) =>
    api.post('/auth/login', data, { withCredentials: true });
export const getUser = () => api.get('/auth/profile');
export const register = (data) => api.post('/users/createUser', data);
export const findUser = (data) => api.get(`/users/${data}`);
export const findUsers = (params) => {
    return api.get(`/users`, { params });
};
