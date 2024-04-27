<template>
  <div
    class="application-zone"
    :class="{
      'search-start': isSearchStart,
      searchTransitionEnd: searchTransitionEnd,
    }"
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
import { ref } from "vue";
const searchStart = () => {
  isSearchStart.value = true;
  setTimeout(() => (searchTransitionEnd.value = true), 600);
};
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/AuthStore.js";
const authStore = useAuthStore();

import { useRouter } from "vue-router";
const router = useRouter();

const isSearchStart = ref(false);
const searchTransitionEnd = ref(false);

const userIsAut = authStore.userState.status.loggedIn;
if (!userIsAut) {
  router.push("/auth");
} else {
  router.push("/");
}
</script>
<style scoped></style>
