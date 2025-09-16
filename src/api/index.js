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

//User
export const login = (data) =>
    api.post('/auth/login', data, { withCredentials: true });
export const getUser = () => api.get('/auth/profile');
export const register = (data) => api.post('/users/createUser', data);
export const findUser = (data) => api.get(`/users/${data}`);
export const findUsers = (params) => {
    return api.get(`/users`, { params });
};

export const updateUser = (data) => {
    return api.patch('/users/update', data);
};

export const addFriend = (friend_id) => {
    return api.post('/users/add-friend', { friend_id });
};

export const acceptFriend = (friend_id) => {
    return api.patch(`/users/accept-friend/${friend_id}`);
};

//conversations
export const getListConversation = () => api.get(`/conversations`);

export const getListConversationByQuery = (params) => {
    return api.get(`/conversations/search`, { params });
};

export const getConversationDetail = (id) => api.get(`/conversations/${id}`);

//message
export const getMessageList = (id) => api.get(`/message/${id}`);
export const sendMessage = (data) => api.post('/message', data);
