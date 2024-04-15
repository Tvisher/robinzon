<template>
  <body class="body">
    <div class="home-page">
      <header class="header"></header>
      <main class="main">
        <div class="home-page__wrapper">
          <div class="home-page__content">
            <div class="left-blur">
              <img src="./assets/img/left-blur.svg" alt="" />
            </div>
            <div class="right-blur">
              <img src="./assets/img/right-blur.svg" alt="" />
            </div>

            <div class="home-page__content-inner">
              <h1 class="home-page__title">
                <span class="color-title">{ Привет }</span> <br />
                Меня зовут Робинзон!
              </h1>
              <span class="home-page__descr">
                Я найду для вас самую актуальную информацию по любой теме в
                открытых источниках и подготовлю в формате структурированного
                отчета, который удобно читать и понимать.
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
        </div>
      </main>
      <footer class="footer"></footer>
    </div>
  </body>
</template>

<script setup>
import { ref } from "vue";

const requestMessage = ref("");
const getRequest = () => {
  console.log(requestMessage.value);
};
</script>
<style scoped></style>
