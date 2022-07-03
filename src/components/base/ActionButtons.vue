<template>
  <div>
    <q-btn
      v-if="isCreate"
      round
      color="primary"
      icon="person_add"
      no-caps
      class="q-mr-xs"
      @click="doAction('Create')"
    >
      <Tool-Tip>Add New Record</Tool-Tip>
    </q-btn>
    <q-btn
      v-if="isUpdate"
      round
      color="amber"
      icon="edit"
      no-caps
      class="q-mr-xs"
      @click="doAction('Update')"
    >
      <Tool-Tip>Edit Selcted Record</Tool-Tip>
    </q-btn>
    <q-btn
      v-if="isDelete"
      round
      color="deep-orange"
      icon="delete"
      no-caps
      class="q-mr-xs"
      @click="doAction('Delete')"
    >
      <Tool-Tip>Delete Selected Rows</Tool-Tip>
    </q-btn>
    <q-btn
      v-if="isExcel"
      round
      color="primary"
      icon="archive"
      no-caps
      class="q-mr-xs gt-sm"
      @click="doAction('Excel')"
    >
      <Tool-Tip>Excel Report</Tool-Tip>
    </q-btn>

    <q-btn
      v-if="isSearch"
      round
      color="purple"
      icon="search"
      no-caps
      class="q-mr-xs"
      @click="doAction('Search')"
    >
      <Tool-Tip>Search Rows</Tool-Tip>
    </q-btn>
    <q-btn
      v-if="isVisible"
      round
      color="positive"
      icon="visibility"
      no-caps
      class="q-mr-xs"
      @click="doAction('Visible')"
    >
      <Tool-Tip>Show / Hide columns</Tool-Tip>
    </q-btn>
    <q-btn
      v-if="isSort"
      round
      color="negative"
      icon="sort"
      no-caps
      class="q-mr-xs"
      @click="doAction('Sort')"
    >
      <Tool-Tip>Sort Rows</Tool-Tip>
    </q-btn>

    <q-btn
      v-if="isSelectAll"
      round
      color="info"
      icon="fullscreen"
      no-caps
      @click="doAction('SelectAll')"
    >
      <Tool-Tip>Full Screen</Tool-Tip>
    </q-btn>
  </div>
</template>

<script>
import BaseTooltip from "components/base/BaseTooltip.vue";
export default {
  name: "ActionButtons",
  components: {
    //    ToolTip: () => import("components/base/BaseTooltip.vue"),
    ToolTip: BaseTooltip,
  },
  props: {
    isCreate: {
      type: Boolean,
      default: true,
    },
    isUpdate: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isExcel: {
      type: Boolean,
      default: false,
    },
    isSearch: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    isSort: {
      type: Boolean,
      default: false,
    },
    isSelectAll: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["buttonAction"],
  setup(prop, { emit }) {
    const doAction = (action) => {
      emit("buttonAction", action);
    };
    return { ...prop, doAction };
  },
};
</script>
