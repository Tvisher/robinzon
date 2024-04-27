import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';


const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
const userInfo = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const useAuthStore = defineStore("AuthStore ", () => {
    if (user) {
        const expiresAt = new Date(user.expires_at);
        const refreshTokenExpiresAt = new Date(user.refresh_token_expires_at);
        console.log(expiresAt);
        const now = new Date();

        const isAccessTokenValid = expiresAt > now;
        const isRefreshTokenValid = refreshTokenExpiresAt > now;

        const tokensInfo = {
            'Access token': expiresAt,
            'Refresh token': refreshTokenExpiresAt
        }
        console.log(tokensInfo);
        // console.log("Access token is valid:", isAccessTokenValid, expiresAt);
        // console.log("Refresh token is valid:", isRefreshTokenValid, refreshTokenExpiresAt);
    }

    const userState = ref(userInfo);

    const logOut = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        userState.value = { status: { loggedIn: false }, user: null }
    }

    const logIn = async (params) => {
        const { protocol, host, pathname } = window.location;
        console.log(protocol, host, pathname);
        return new Promise((resolve, reject) => {
            const url = import.meta.env.MODE == "development" ? "http://49.12.122.181:8034/login"
                : `/login`;
            console.log(url);
            // .replace(/\.[^.]+$/, "")
            axios
                .post(url, params.authData)
                .then((response) => {
                    if (response.status == 200) {
                        const resp = JSON.stringify(response.data);
                        if (params.rememberUser) {
                            localStorage.setItem("user", resp);
                        } else {
                            sessionStorage.setItem("user", resp);
                        }
                        userState.value.status.loggedIn = true;
                        userState.value.user = JSON.parse(resp);
                        resolve()
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject()
                })
        })
    }

    return {
        userState, logOut, logIn
    }
})




