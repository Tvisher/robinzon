<template>
  <div class="auth_zone">
    <div class="auth_form">
      <div class="auth_form__head">
        <div class="head-wrapper">
          <div class="auth_form__title">Вход</div>
          <div class="auth_form__descr">Для входа, введите логин и пароль</div>
        </div>
      </div>
      <form
        class="auth_form__body"
        @submit.prevent="getAuth"
        :class="{ sending: sending }"
      >
        <label
          class="auth_form__label"
          :class="{
            error: userData.errors.includes('login-error'),
          }"
        >
          <span>Логин</span>
          <div class="label-filed-wrapper">
            <div class="label-filed__ico">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_380_213)">
                  <path
                    d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z"
                    stroke="#00FFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 7L12 13L21 7"
                    stroke="#00FFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_380_213">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <input
              name="username"
              type="text"
              class="filed-input"
              placeholder="Email"
              @focus="inputFocus"
              @blur="inputBlur"
              v-model.trim="userData.login"
              @input="removeFieldError('login-error')"
            />
          </div>
        </label>

        <label
          class="auth_form__label"
          :class="{
            error: userData.errors.includes('password-error'),
          }"
        >
          <span>Пароль</span>
          <div class="label-filed-wrapper">
            <div class="label-filed__ico">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_380_221)">
                  <path
                    d="M16.555 3.84305L20.157 7.44505C20.4242 7.71221 20.6362 8.02939 20.7808 8.37847C20.9254 8.72755 20.9998 9.1017 20.9998 9.47955C20.9998 9.8574 20.9254 10.2316 20.7808 10.5806C20.6362 10.9297 20.4242 11.2469 20.157 11.5141L17.514 14.1571C17.2468 14.4243 16.9297 14.6362 16.5806 14.7808C16.2315 14.9254 15.8573 14.9999 15.4795 14.9999C15.1017 14.9999 14.7275 14.9254 14.3784 14.7808C14.0293 14.6362 13.7122 14.4243 13.445 14.1571L13.144 13.8561L6.586 20.4141C6.25372 20.7463 5.81507 20.9509 5.347 20.9921L5.172 21.0001H4C3.75507 21 3.51866 20.9101 3.33563 20.7473C3.15259 20.5846 3.03566 20.3603 3.007 20.1171L3 20.0001V18.8281C3.00011 18.3585 3.16543 17.904 3.467 17.5441L3.586 17.4141L4 17.0001H6V15.0001H8V13.0001L10.144 10.8561L9.843 10.5551C9.5758 10.2879 9.36384 9.97071 9.21923 9.62163C9.07462 9.27255 9.00019 8.8984 9.00019 8.52055C9.00019 8.1427 9.07462 7.76855 9.21923 7.41947C9.36384 7.07039 9.5758 6.75321 9.843 6.48605L12.486 3.84305C12.7532 3.57585 13.0703 3.36389 13.4194 3.21928C13.7685 3.07467 14.1427 3.00024 14.5205 3.00024C14.8983 3.00024 15.2725 3.07467 15.6216 3.21928C15.9707 3.36389 16.2878 3.57585 16.555 3.84305Z"
                    stroke="#00FFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 9H15.01"
                    stroke="#00FFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_380_221">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <input
              name="password"
              :type="showPass ? 'text' : 'password'"
              class="filed-input _pass"
              placeholder="Password"
              @focus="inputFocus"
              @blur="inputBlur"
              v-model.trim="userData.password"
              @input="removeFieldError('password-error')"
            />
            <div
              class="label-filed__show-or-hide"
              @pointerdown="showPass = true"
              @pointerup="showPass = false"
            ></div>
          </div>
        </label>
        <div class="custom-cb">
          <input
            type="checkbox"
            class="custom-cb__input"
            v-model="userData.remember"
          />
          <span class="custom-cb__text">Запомнить меня</span>
        </div>

        <button type="submit" class="btn submit-btn">ВОЙТИ</button>
        <div class="form-errors">
          <span v-for="error in errorsTranslate">{{ error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, computed } from "vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/AuthStore.js";
const authStore = useAuthStore();

const { userState } = storeToRefs(authStore);

import { useRouter } from "vue-router";
const router = useRouter();
const userIsAuth = userState.value.status.loggedIn;
if (userIsAuth) {
  router.push("/");
}

const userData = ref({
  login: "",
  password: "",
  errors: [],
  remember: true,
});
const showPass = ref(false);
const sending = ref(false);
const errorsTranslate = computed(() => {
  return userData.value.errors.map((el) => {
    switch (el) {
      case "login-error":
        return "Введите Логин";
        break;
      case "password-error":
        return "Введите Пароль";
        break;
      case "auth-error":
        return "Не верный Логин или Пароль";
        break;
      default:
        break;
    }
  });
});

const removeFieldError = (error) => {
  userData.value.errors = userData.value.errors.filter((el) => {
    console.log(el == "auth-error");
    return el != error && el !== "auth-error";
  });
};

const getAuth = (event) => {
  const data = userData.value;
  if (!data.login) {
    data.errors.push("login-error");
  }

  if (!data.password) {
    data.errors.push("password-error");
  }

  if (data.errors.length > 0) {
    return;
  }
  sending.value = true;
  const rememberUser = data.remember;
  const authData = `username=${userData.value.login}&password=${userData.value.password}`;
  authStore
    .logIn({
      authData,
      rememberUser,
    })
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      data.errors.push("auth-error");
    })
    .finally((res) => {
      sending.value = false;
    });
};

const inputFocus = (event) =>
  event.target.closest(".label-filed-wrapper").classList.add("focus");
const inputBlur = (event) =>
  event.target.closest(".label-filed-wrapper").classList.remove("focus");
</script>

<style lang="scss"></style>
