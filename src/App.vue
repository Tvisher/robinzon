<template>
  <div
    class="application-zone"
    :class="{
      'search-start': isSearchStart,
      searchTransitionEnd: searchTransitionEnd,
    }"
    v-if="appLoad"
  >
    <div class="application-zone__image">
      <img src="@/assets/img/bg-man.png" alt="" />
    </div>

    <div class="application-zone__content">
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade">
          <component :is="Component" @searchStartEvent="searchStart" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/AuthStore.js";
const authStore = useAuthStore();
const { userState } = storeToRefs(authStore);
import { useRouter } from "vue-router";
const router = useRouter();

const isSearchStart = ref(false);
const searchTransitionEnd = ref(false);
const appLoad = ref(false);

const searchStart = () => {
  isSearchStart.value = true;
  setTimeout(() => (searchTransitionEnd.value = true), 600);
};

onBeforeMount(async () => {
  const userData = userState.value;
  const userIsAuth = userData.status.loggedIn;
  // Если пользователь уже авторизировался
  if (userIsAuth) {
    // Проверяем жив ли access_token
    const accessTokenIsExpired =
      new Date(userData.user.expires_at) < new Date();
    if (accessTokenIsExpired) {
      // Проверяем жив ли refresh_token
      const refreshTokenIsExpired =
        new Date(userData.user.refresh_token_expires_at) < new Date();

      if (!refreshTokenIsExpired) {
        authStore
          .updateAccessToken()
          .then(() => {
            router.push("/");
            appLoad.value = true;
          })
          .catch((error) => {
            authStore.logOut();
            router.push("/auth").then(() => {
              appLoad.value = true;
            });
          });
      } else {
        authStore.logOut();
        router.push("/auth");
        appLoad.value = true;
      }
    } else {
      router.push("/");
      appLoad.value = true;
    }
  } else {
    router.push("/auth");
    appLoad.value = true;
  }
});
</script>
<style scoped></style>
