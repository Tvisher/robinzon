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
                  v-for="(respItem, index) in wsResponce.messages"
                  :key="index"
                  :message="respItem"
                />
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
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

let websocket = null;

const converter = new showdown.Converter();
const getRequest = () => {
  if (searchInProgress.value || requestMessage.value.length < 1) return;
  if (!searchStart.value) {
    searchStart.value = !searchStart.value;
    emit("searchStartEvent");
  }
  sendWsMessage();
};

const updateWsResponce = (status, value) => {
  const lastMesage =
    wsResponce.value.messages[wsResponce.value.messages.length - 1];
  lastMesage.messageStatus = status;

  if (status === "logs") {
    lastMesage.agentResponce += converter.makeHtml(value);
  }

  if (status === "report") {
    lastMesage.report.hasReport = true;
    lastMesage.report.value += converter.makeHtml(value);
    console.log(value);
    lastMesage.report.text += value;
  }

  if (status === "path") {
    requestMessage.value = "";
    searchInProgress.value = false;
    wsResponce.value.status = "finished";
    lastMesage.messageStatus = "finished";
    lastMesage.btns = value;
  }
};

const sendWsMessage = () => {
  searchInProgress.value = true;
  wsResponce.value.messages.push({
    showAgentResponce: false,
    agentResponce: "",
    report: {
      value: "",
      text: "",
      hasReport: false,
    },
    messageStatus: "",
    btns: {},
  });

  const requestData = {
    task: requestMessage.value,
    report_type: "detailed_report",
    agent: true,
  };
  websocket.send(`start ${JSON.stringify(requestData)}`);

  setTimeout(() => {
    renderStart.value = true;
    const renderZoneContent = document.querySelector(".render-zone__content");
    if (renderZoneContent) {
      renderZoneContent.scrollBy({
        top: renderZoneContent.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, 650);
};

const logOut = () => {
  authStore.logOut();
  router.push("/auth");
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
      console.log("Ошибка парсинга ответа из Websocket");
    }
  };
  websocket.onopen = (event) => {
    console.log("Websocket Open:", event);
  };

  websocket.onerror = (event) => {
    console.log("Websocket Error:", event);
  };

  websocket.onclose = (event) => {
    console.log("Websocket close:", event);
  };
};

onMounted(() => {
  websocketInit();
});

onBeforeUnmount(() => {
  if (websocket) {
    websocket.close();
  }
});
</script>
<style scoped></style>
