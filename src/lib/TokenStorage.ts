import {cookies} from "next/headers";

const ACCESS_TOKEN = 'ACCESS_TOKEN';

export default {
    updateToken(token: string) {
        return localStorage.setItem(ACCESS_TOKEN, token);
    },
    getToken() {
        return localStorage.getItem(ACCESS_TOKEN);
    },
    removeToken() {
        return localStorage.removeItem(ACCESS_TOKEN);
    }
}
