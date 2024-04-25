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

import { useAppData } from "@/stores/AppData";
const appData = useAppData();
const userIsAut = appData.isAuth;
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

if (!userIsAut) {
  router.push("Auth");
}

const isSearchStart = ref(false);
const searchTransitionEnd = ref(false);
const requestMessage = ref("");
const getRequest = () => {
  console.log(requestMessage.value);
};
</script>
<style scoped></style>
