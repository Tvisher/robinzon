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
      <a href="javascript:void(0)" class="app-menu__logout" @click="logOut"
        >ВЫЙТИ</a
      >
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

      <form
        class="home-page__form"
        @submit.prevent="getRequest"
        :class="{ blocked: searchInProgress }"
      >
        <label class="form-label">
          <input
            type="text"
            class="form-field"
            placeholder="Что будем исследовать?"
            v-model.trim="requestMessage"
            :readonly="searchInProgress"
          />
          <button type="submit" class="form-btn">ИССЛЕДОВАТЬ</button>
        </label>
      </form>
    </div>
    <transition name="fade-in" mode="out-in">
      <div class="render-zone" v-if="renderStart">
        <div class="render-zone__content">
          <div class="container">
            <div class="render-zone__response">
              <transition-group name="list">
                <AiAnswer
                  v-for="respItem in wsResponce.messages"
                  :key="respItem.id"
                  :message="respItem"
                  :searchInProgress="searchInProgress"
                  @regenerateResponse="regenerateResponse"
                />
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade-in" mode="out-in">
      <div class="error-modal" v-if="showErrorModal">
        <div class="error-modal__close" @click="closeErrorModal"></div>
        <div class="error-modal__wrapper">
          <div class="error-modal__ico"></div>
          <div class="error-modal__content">
            <div class="error-modal__title">Упс! Что-то пошло не так...</div>
            <div class="error-modal__message">
              Мы столкнулись с непредвиденной ошибкой на нашем сервере. Наша
              команда уже работает над устранением этой проблемы. Мы приносим
              свои извинения за любые неудобства и благодарим за ваше терпение.
              <br />
              <br />
              Пожалуйста, попробуйте снова чуть позже. Если ошибка будет
              повторяться, не стесняйтесь обращаться в службу поддержки.<br /><br />
            </div>
            <div class="error-modal__end">Спасибо за понимание!</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref, onMounted, onBeforeUnmount } from "vue";
import AiAnswer from "@/components/AiAnswer.vue";
import { showdown } from "vue-showdown";
import { useRouter } from "vue-router";
const router = useRouter();

import { useAuthStore } from "@/stores/AuthStore.js";
const authStore = useAuthStore();
const emit = defineEmits(["searchStartEvent"]);

const searchStart = ref(false);
const searchInProgress = ref(false);
const requestMessage = ref("");
const renderStart = ref(false);
const wsResponce = ref({
  status: "",
  messages: [],
});
const showErrorModal = ref(false);
let websocket = null;
const reconnectInterval = ref(500);
const maxReconnectInterval = 15000;
let reconnectAttempts = 0;
const defaultMessage = {
  id: "",
  requestMessage: "",
  showAgentResponce: false,
  agentResponce: "",
  report: {
    value: "",
    text: "",
    hasReport: false,
  },
  messageStatus: "",
  btns: {},
};
const requestMessageId = ref("");

// let testTrigger = 1;

const converter = new showdown.Converter();
const getRequest = () => {
  if (searchInProgress.value || requestMessage.value.length < 1) return;
  if (!searchStart.value) {
    searchStart.value = !searchStart.value;
    emit("searchStartEvent");
  }
  sendWsMessage();
  showErrorModal.value = false;
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const updateWsResponce = (status, value) => {
  wsResponce.value.status = "work";
  let requestMessageItem;
  if (requestMessageId.value) {
    requestMessageItem = wsResponce.value.messages.find(
      (el) => el.id == requestMessageId.value
    );
  } else {
    requestMessageItem =
      wsResponce.value.messages[wsResponce.value.messages.length - 1];
  }

  requestMessageItem.messageStatus = status;
  if (status === "logs") {
    requestMessageItem.agentResponce += converter.makeHtml(value);
  }

  if (status === "report") {
    requestMessageItem.report.hasReport = true;
    requestMessageItem.report.value += converter.makeHtml(value);
    requestMessageItem.report.text += value;
  }

  if (status === "path") {
    requestMessage.value = "";
    searchInProgress.value = false;
    requestMessageItem.messageStatus = "finished";
    requestMessageItem.btns = value;
    wsResponce.value.status = "";
  }
};

const regenerateResponse = (messageId) => {
  requestMessageId.value = messageId;
  let regenerateMessage = wsResponce.value.messages.find(
    (el) => el.id == messageId
  );
  const message = regenerateMessage.requestMessage;
  regenerateMessage.report = {
    value: "",
    text: "",
    hasReport: false,
  };
  regenerateMessage.showAgentResponce = false;
  regenerateMessage.agentResponce = "";
  regenerateMessage.messageStatus = "";
  regenerateMessage.btns = {};
  sendWsMessage(true, message);
};

const sendWsMessage = (isRegenerate, message) => {
  searchInProgress.value = true;
  let taskMessage;
  if (!isRegenerate) {
    taskMessage = requestMessage.value;
    requestMessageId.value = "";
    const messageTemplate = JSON.parse(JSON.stringify(defaultMessage));
    messageTemplate.requestMessage = requestMessage.value;
    messageTemplate.id = uuidv4();
    wsResponce.value.messages.push(messageTemplate);
  } else {
    taskMessage = message;
  }

  const requestData = {
    task: taskMessage,
    report_type: "detailed_report",
    agent: true,
  };

  if (websocket.readyState == 1) {
    websocket.send(`start ${JSON.stringify(requestData)}`);
  } else {
    showErrorModal.value = true;
    wsResponce.value.status = "error";
    searchInProgress.value = false;
    let requestMessage;
    if (requestMessageId.value) {
      requestMessage = wsResponce.value.messages.find(
        (el) => el.id == requestMessageId.value
      );
    } else {
      requestMessage =
        wsResponce.value.messages[wsResponce.value.messages.length - 1];
    }
    requestMessage.messageStatus = "error";
  }

  setTimeout(() => {
    renderStart.value = true;
    const renderZoneContent = document.querySelector(".render-zone__content");
    if (renderZoneContent && !isRegenerate) {
      renderZoneContent.scrollBy({
        top: renderZoneContent.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, 650);
};

const logOut = () => {
  authStore.logOut().finally(() => router.push("/auth"));
};
const websocketInit = () => {
  const { protocol, host, pathname } = window.location;
  const token = authStore.userState.user.access_token;
  const ws_uri =
    import.meta.env.MODE == "development"
      ? `ws://49.12.122.181:8034/ws?token=${encodeURIComponent(token)}`
      : `${
          protocol === "https:" ? "wss:" : "ws:"
        }//${host}${pathname}ws?token=${encodeURIComponent(token)}`;

  websocket = new WebSocket(ws_uri);
  websocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateWsResponce(data.type, data.output);
    } catch (exception) {
      console.log("Ошибка парсинга ответа сервера");
      showErrorModal.value = true;
      wsResponce.value.status = "error";
      searchInProgress.value = false;
      let requestMessage;
      if (requestMessageId.value) {
        requestMessage = wsResponce.value.messages.find(
          (el) => el.id == requestMessageId.value
        );
      } else {
        requestMessage =
          wsResponce.value.messages[wsResponce.value.messages.length - 1];
      }
      requestMessage.messageStatus = "error";
    }
  };
  websocket.onopen = (event) => {
    console.log("Websocket Open:", event);
    wsResponce.value.status = "open";
    reconnectAttempts = 0;
    // if (testTrigger == 1) {
    //   setTimeout(() => {
    //     websocket.close();
    //     testTrigger = 2;
    //   }, 10000);
    // }
  };

  websocket.onerror = (event) => {
    console.log("Websocket Error:", event);
  };

  websocket.onclose = (event) => {
    console.log("Websocket Сlose:", event.code);
    if (event.code !== 1000) {
      const userData = authStore.userState;
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
              reconnectWebSocket();
            })
            .catch((error) => {
              console.log("Connection failed.");
            });
        } else {
          authStore.logOut();
          router.push("/auth");
        }
      } else {
        reconnectWebSocket();
      }
    }
  };
};

const reconnectWebSocket = () => {
  if (reconnectAttempts < 5) {
    reconnectAttempts++;
    const reconnectDelay = Math.min(
      reconnectInterval.value * Math.pow(2, reconnectAttempts),
      maxReconnectInterval
    );

    setTimeout(() => {
      console.log(`Attempting to reconnect (#${reconnectAttempts})...`);
      websocketInit();
      if (wsResponce.value.status == "work") {
        showErrorModal.value = true;
        wsResponce.value.status = "error";
        const lastMessage =
          wsResponce.value.messages[wsResponce.value.messages.length - 1];
        searchInProgress.value = false;
        lastMessage.messageStatus = "error";
      }
    }, reconnectDelay);
  } else {
    console.error("Max reconnect attempts reached. Connection failed.");
  }
};

onMounted(() => {
  websocketInit();
});

onBeforeUnmount(() => {
  if (websocket) {
    websocket.close(1000);
  }
});
</script>
<style scoped></style>
