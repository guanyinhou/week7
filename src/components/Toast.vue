<template>
  <div class="toast-outer">
    <div
      v-for="(item, i) in messages"
      class="toast fade show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-autohide="false"
      :id="`toast-${i}`"
      :key="i"
    >
      <div class="toast-header">
        <div class="alert-color" :class="`bg-${item.status}`"></div>
        <strong class="mr-auto">訊息</strong>
        <small>現在</small>
        <button
          type="button"
          class="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close"
          @click="closeToast(`toast-${i}`)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        {{ item.message }}
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  data() {
    return {
      messages: []
    };
  },
  created() {
    const vm = this;
    vm.$bus.$on("message:push", (message, status = "warning") => {
      vm.updateMessage(message, status);
    });
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    },
    closeToast(ele) {
      $(`#${ele}`).toast("hide");
    }
  }
};
</script>
