<template>
  <q-dialog v-model="showModal" seamless @update="listenModal">
    <q-card :style="dialogStyle" style="resize: both">
      <q-bar
        v-touch-pan.mouse="onPan"
        class="bg-primary text-white cursor-pointer"
      >
        <q-icon :name="icon" />
        <div>{{ title }}</div>
        <q-space />
        <q-btn dense flat round icon="close" @click="close(false)">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ModalBase",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "search",
    },
    size: {
      type: String,
      default: "500px",
    },
  },
  emits: ["close", "open"],
  data() {
    return {
      dialogPos: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    showModal: function () {
      return this.show;
    },
    dialogStyle() {
      return {
        transform: `translate(${this.dialogPos.x}px, ${this.dialogPos.y}px)`,
        width: this.size,
      };
    },
  },
  methods: {
    listenModal: function (val) {
      console.log("listing", val);
    },
    close: function (payload) {
      this.$emit("close", payload);
    },
    open() {
      this.$emit("open");
    },
    onPan(evt) {
      this.dialogPos = {
        x: this.dialogPos.x + evt.delta.x,
        y: this.dialogPos.y + evt.delta.y,
      };
    },
  },
};
</script>

<style scoped></style>
