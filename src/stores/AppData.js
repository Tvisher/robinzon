import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// import axios from 'axios';

export const useAppData = defineStore("AppData", () => {
    const isAuth = ref(false);
    return {
        isAuth
    }
})




