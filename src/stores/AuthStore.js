import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';


const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
const userInfo = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

const getActualStorage = (payload) => {
    const json = JSON.stringify(payload);
    if (localStorage.getItem('user')) {
        localStorage.setItem('user', json);
    }
    if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', json);
    }
}
export const useAuthStore = defineStore("AuthStore ", () => {
    const userState = ref(userInfo);

    const logOut = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        userState.value = { status: { loggedIn: false }, user: null }
    }

    const logIn = async (params) => {
        const { protocol, host, pathname } = window.location;
        return new Promise((resolve, reject) => {
            const url = import.meta.env.MODE == "development" ? "http://49.12.122.181:8034/login"
                : `/login`;
            axios
                .post(
                    url,
                    params.authData,
                    {
                        headers:
                            { "Content-Type": "application/x-www-form-urlencoded" }
                    },
                )
                .then((response) => {
                    if (response.status == 200) {
                        const respAuthData = response.data;
                        // Назначем время жизни токенов на клиенте 
                        respAuthData.expires_at = new Date(Date.now() + respAuthData.expires_in * 1000);
                        respAuthData.refresh_token_expires_at = new Date(Date.now() + respAuthData.refresh_expires_in * 1000);
                        // console.log(respAuthData);

                        if (params.rememberUser) {
                            localStorage.setItem("user", JSON.stringify(respAuthData));
                        } else {
                            sessionStorage.setItem("user", JSON.stringify(respAuthData));
                        }
                        userState.value.user = respAuthData;
                        userState.value.status.loggedIn = true;
                        resolve()
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject()
                })
        })
    }

    const updateAccessToken = async () => {
        return new Promise((res, rej) => {
            const url = import.meta.env.MODE == "development" ? "http://49.12.122.181:8034/refresh" : `/refresh`;
            axios
                .post(url, { 'refresh_token': userState.value.user.refresh_token },
                    {
                        headers: { Authorization: `Bearer ${userState.value.user.refresh_token}` }
                    }
                )
                .then((response) => {
                    if (response.status == 200) {
                        const data = response.data;
                        const userData = userState.value.user
                        userData.access_token = data.access_token;
                        userData.expires_at = new Date(Date.now() + data.expires_in * 1000);

                        userData.refresh_token = data.refresh_token;
                        userData.refresh_token_expires_at = new Date(Date.now() + data.refresh_expires_in * 1000);
                        getActualStorage(userData)
                        res()
                    }
                })
                .catch((error) => {
                    console.log(error);
                    rej()
                })
        })
    }

    return {
        userState,
        logOut,
        logIn,
        updateAccessToken

    }
})




