<template>
  <div class="response__item">
    <div class="head-ico"></div>
    <div class="item-content">
      <div class="agent-response">
        <div
          class="agent-response__head"
          @click="
            props.message.showAgentResponce = !props.message.showAgentResponce
          "
          :class="{ open: props.message.showAgentResponce }"
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
          <Vue3SlideUpDown v-model="props.message.showAgentResponce">
            <div class="descr">
              Агент, специально созданный для вашей задачи, будет сгенерирован
              для предоставления наиболее точных и релевантных результатов
              исследования.
            </div>
            <hr />
            <div
              class="agent-response__inner"
              v-html="props.message.agentResponce"
            ></div>
          </Vue3SlideUpDown>
        </div>
      </div>
      <div v-if="props.message.messageStatus != 'error'">
        <Vue3SlideUpDown v-model="props.message.report.hasReport">
          <div class="agent-report">
            <div class="agent-report__content">
              <div class="agent-report__title">Исследовательский отчет</div>
              <div v-html="props.message.report.value"></div>
            </div>
          </div>
        </Vue3SlideUpDown>

        <div
          class="agent-report-btns"
          v-if="props.message.messageStatus == 'finished'"
        >
          <div class="agent-report-btn _clipboard" @click="copyToClipboard">
            скопировать в буфер обмена
          </div>
          <a
            :href="message.btns.pdf"
            v-if="message.btns.pdf"
            target="_blank"
            class="agent-report-btn _pdf"
            download
            >скачать pdf</a
          >

          <a
            :href="message.btns.docx"
            v-if="message.btns.docx"
            target="_blank"
            class="agent-report-btn _docs"
            download
            >скачать docx</a
          >
        </div>
        <div
          class="agent-status"
          v-if="props.message.messageStatus != 'finished'"
        >
          <div class="status-ico">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="status-text">Подождите, идет генерация исследования</div>
        </div>
      </div>
      <div class="agent-report" v-else>
        <h1>
          Попробуйте сгенерировать запрос "{{ props.message.requestMessage }}"
          снова
        </h1>
        <button
          :class="{ blocked: props.searchInProgress }"
          type="button"
          class="form-btn"
          @click="regenerateResponse"
        >
          СГЕНЕРИРОВАТЬ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Vue3SlideUpDown } from "vue3-slide-up-down";
import { toClipboard } from "@soerenmartius/vue3-clipboard";

const props = defineProps({
  message: Object,
  searchInProgress: Boolean,
});

const regenerateResponse = () => {
  if (props.searchInProgress) return;
  emit("regenerateResponse", props.message.id);
};

const emit = defineEmits(["regenerateResponse"]);

const copyToClipboard = () => {
  toClipboard(props.message.report.text);
};
</script>
<style scoped></style>
