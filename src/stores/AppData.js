import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// import axios from 'axios';


const userIsAuth = localStorage.getItem('isAuth');
console.log(userIsAuth);
export const useAppData = defineStore("AppData", () => {
    const isAuth = ref(userIsAuth);
    return {
        isAuth
    }
})




