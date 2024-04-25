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
              <div
                class="response__item"
                v-for="(respItem, index) in wsResponce.messages"
                :key="index"
              >
                <div class="head-ico"></div>
                <div class="item-content">
                  <div class="agent-response">
                    <div
                      class="agent-response__head"
                      @click="
                        respItem.showAgentResponce = !respItem.showAgentResponce
                      "
                      :class="{ open: respItem.showAgentResponce }"
                    >
                      <span>Вывод агента</span>
                      <div class="arrow">
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M9.80113 1.22462L5.48011 5.78989C5.21495 6.07004 4.78505 6.07004 4.51989 5.78989L0.198869 1.22462C-0.0662898 0.944468 -0.0662898 0.490259 0.198869 0.210111C0.464029 -0.0700369 0.893936 -0.0700369 1.1591 0.210111L5 4.26813L8.8409 0.210111C9.10606 -0.0700369 9.53597 -0.0700369 9.80113 0.210111C10.0663 0.490259 10.0663 0.944468 9.80113 1.22462Z"
                            fill="#00FFFF"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="agent-response__content">
                      <Vue3SlideUpDown v-model="respItem.showAgentResponce">
                        <div class="descr">
                          Агент, специально созданный для вашей задачи, будет
                          сгенерирован для предоставления наиболее точных и
                          релевантных результатов исследования.
                        </div>
                        <hr />
                        <div
                          class="agent-response__inner"
                          v-html="respItem.agentResponce"
                        ></div>
                      </Vue3SlideUpDown>
                    </div>
                  </div>
                  <Vue3SlideUpDown v-model="respItem.report.hasReport">
                    <div class="agent-report">
                      <div class="agent-report__title">
                        Исследовательский отчет
                      </div>
                      <div v-html="respItem.report.value"></div>
                    </div>
                  </Vue3SlideUpDown>
                  <div
                    class="agent-report-btns"
                    v-if="respItem.messageStatus == 'finished'"
                  >
                    <div class="agent-report-btn _clipboard">
                      скопировать в буфер обмена
                    </div>
                    <a
                      :href="respItem.btns.pdf"
                      target="_blank"
                      class="agent-report-btn _pdf"
                      >скачать pdf</a
                    >
                  </div>
                  <div
                    class="agent-status"
                    v-if="respItem.messageStatus != 'finished'"
                  >
                    <div class="status-ico"></div>
                    <div class="status-text">
                      Подождите, идет генерация исследования
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Vue3SlideUpDown } from "vue3-slide-up-down";
import { showdown } from "vue-showdown";
const emit = defineEmits(["searchStartEvent"]);
const searchStart = ref(false);
const searchInProgress = ref(false);
const requestMessage = ref("");
const renderStart = ref(false);
const wsResponce = ref({
  status: "",
  messages: [],
});

const blockHeight = computed(() => {
  // Получите высоту содержимого блока
  return blockRef.value ? blockRef.value.clientHeight : 0;
});

const messageHasReport = (ind) => {
  returnwsResponce.value.messages[wsResponce.value.messages.length - 1].report
    .length > 0;
};
const converter = new showdown.Converter();

const getRequest = () => {
  if (searchInProgress.value || requestMessage.value.length < 1) return;
  if (!searchStart.value) {
    searchStart.value = !searchStart.value;
    emit("searchStartEvent");
  }
  listenToSockEvents();
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
  }

  if (status === "path") {
    requestMessage.value = "";
    searchInProgress.value = false;
    wsResponce.value.status = "finished";
    lastMesage.messageStatus = "finished";
    lastMesage.btns = value;
  }
};

const listenToSockEvents = () => {
  const { protocol, host, pathname } = window.location;

  // const ws_uri =
  //   import.meta.env.MODE == "development"
  //     ? "ws://49.12.122.181:8033/ws"
  //     : `${protocol === "https:" ? "wss:" : "ws:"}//${host}${pathname}ws`;
  const ws_uri = "ws://49.12.122.181:8033/ws";
  const socket = new WebSocket(ws_uri);
  searchInProgress.value = true;
  wsResponce.value.messages.push({
    showAgentResponce: false,
    agentResponce: "",
    report: {
      value: "",
      hasReport: false,
    },
    messageStatus: "",
    btns: {},
  });

  setTimeout(() => {
    renderStart.value = true;
  }, 600);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    updateWsResponce(data.type, data.output);
  };

  socket.onopen = (event) => {
    const task = requestMessage.value;
    const report_type = "detailed_report";
    const agent = true;

    const requestData = {
      task: task,
      report_type: report_type,
      agent: agent,
    };
    socket.send(`start ${JSON.stringify(requestData)}`);
  };
};
</script>
<style scoped></style>
