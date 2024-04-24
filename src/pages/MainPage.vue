<template>
  <div>
    <div class="app-menu">
      <nav class="app-menu__nav">
        <a href="javascript:void(0)">ДИАНА</a>
        <a href="javascript:void(0)">WENDY</a>
        <a href="javascript:void(0)">АНАТОЛИЙ</a>
        <a href="javascript:void(0)">ROBINZON</a>
        <a href="javascript:void(0)">КОЛОМБО</a>
        <a href="javascript:void(0)">VOLTER</a>
      </nav>
      <a href="javascript:void(0)" class="app-menu__logout">ВЫЙТИ</a>
    </div>
    <div class="home-page__content-inner">
      <h1 class="home-page__title">
        <span class="color-title">{ Привет }</span> <br />
        Меня зовут<br />
        Робинзон!
      </h1>
      <span class="home-page__descr">
        Я найду для вас самую актуальную информацию по любой теме в открытых
        источниках и подготовлю в формате структурированного отчета, который
        удобно читать и понимать.
      </span>

      <form class="home-page__form" @submit.prevent="getRequest">
        <label class="form-label">
          <input
            type="text"
            class="form-field"
            placeholder="Что будем исследовать?"
            v-model.trim="requestMessage"
          />
          <button type="submit" class="form-btn">ИССЛЕДОВАТЬ</button>
        </label>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["searchStartEvent"]);
const searchStart = ref(false);

const requestMessage = ref("");
const getRequest = () => {
  if (!searchStart.value) {
    searchStart.value = !searchStart.value;
    emit("searchStartEvent");
  }
  console.log(requestMessage.value, searchStart.value);
};
</script>
<style scoped></style>
