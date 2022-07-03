<template>
  <q-page>
    <Table
      ref="areaTable"
      :columns="columns"
      :where-condition="showModal.whereColumns"
      :retrieve="showModal.retrieve"
      :sort-by="sortedList"
      :company-id="getCompanyId"
      class="q-mx-sm"
      @callAction="onClick"
    />
  </q-page>
  <Modal
    :show="showModal.add"
    icon="add"
    title="Add Category"
    @close="showModal.add = false"
  >
    <AreaCreateUpdate
      :current-row="selectedRow"
      @close="closeModal($event, 'add')"
      :company-id="getCompanyId"
    />
  </Modal>
  <Modal
    :show="showModal.delete"
    icon="delete"
    title="Delete Company(s)"
    @close="closeModal($event, 'delete')"
  >
    <q-card-section>
      <p>Do you want to delete ?</p>
      <p class="q-my-none">Name : {{ deletedValues }}</p>
    </q-card-section>

    <q-card-section class="row justify-end q-pt-none">
      <q-btn
        label="Submit"
        color="green"
        class="q-mr-sm"
        @click="closeModal({ action: true }, 'delete')"
      />
      <q-btn label="close" color="orange" @click="showModal.delete = false" />
    </q-card-section>
  </Modal>

  <Modal
    :show="showModal.visible"
    icon="eye"
    title="Show / Hide column(s)"
    @close="showModal.visible = false"
  >
    <BaseVisibleColumn
      :columns="columns"
      @close="closeModal($event, 'visible')"
    />
  </Modal>

  <Modal
    :show="showModal.search"
    title="Search Area"
    @close="showModal.search = false"
  >
    <Search
      :columns="showModal.whereColumns"
      @close="closeModal($event, 'search')"
    />
  </Modal>

  <Modal
    :show="showModal.sort"
    icon="list_alt"
    title="Sort By Columns"
    @close="showModal.sort = false"
  >
    <SortColumn :columns="columns" @close="closeModal($event, 'sort')" />
  </Modal>
</template>
<script>
import { onMounted, watch, ref, computed, isRef, defineComponent } from "vue";

import { useGlobalStore } from "src/stores/global";
import Table from "./AreaTable.vue";
import Search from "./AreaSearch.vue";
import AreaCreateUpdate from "./AreaCreateUpdate.vue";
import BaseVisibleColumn from "../base/BaseVisibleColumn.vue";
import SortColumn from "../base/SortColumn.vue";
import Modal from "../base/Modal.vue";
import useForm from "src/hooks/useForm";
import useService from "src/hooks/useService";
import { areaColumns } from "src/config/tableColumns";
export default defineComponent({
  name: "AreaList",
  components: {
    Table,
    Search,
    Modal,
    AreaCreateUpdate,
    BaseVisibleColumn,
    SortColumn,
  },
  setup() {
    const store = useGlobalStore();
    const showModal = ref({
      add: false,
      delete: false,
      visible: false,
      search: false,
      fullScreen: false,
      whereColumns: [
        {
          name: "area_name",
          label: "Name",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "area_name_marathi",
          label: "नाव",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "city_name",
          label: "City",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "city_name_marathi",
          label: "शहराचे नाव",
          widget: "text",
          type: "String",
          values: [],
        },
      ],
      retrieve: false,
      sort: false,
    });

    const deletedValues = ref(null);
    const selectedRow = ref([]);
    const deletedRow = ref([]);
    const areaTable = ref();
    const formHandler = useForm();
    const Area = useService("areas");
    const columns = ref([]);
    const sortedList = ref([]);

    columns.value = areaColumns;

    onMounted(() => {
      sortedList.value = formHandler.sortBuilder(columns.value);
    });
    const onClick = async (action) => {
      switch (action) {
        case "Create":
          selectedRow.value = null;
          showModal.value.add = true;
          break;
        case "Update":
          selectedRow.value = areaTable.value.getCurrentRow();
          if (selectedRow.value) {
            showModal.value.add = true;
          }
          break;
        case "Search":
          showModal.value.search = true;
          break;
        case "Delete":
          deletedRow.value = areaTable.value.selected;
          if (deletedRow.value.length > 0) {
            showModal.value.delete = true;
            deletedValues.value = formHandler.deletedList(
              deletedRow.value,
              "area_name"
            );
          }
          break;
        case "SelectAll":
          showModal.value.fullScreen = !showModal.value.fullScreen;
          break;
        case "Visible":
          showModal.value.visible = true;
          break;
        default:
          showModal.value.sort = true;
          break;
      }
    };

    const closeModal = async (payload, modalName) => {
      switch (modalName) {
        case "delete":
          showModal.value.delete = false;
          await Area.remove(deletedRow.value[0].id);
          break;
        case "add":
          showModal.value.add = false;
          break;
        case "visible":
          showModal.value.visible = false;
          if (payload.action) {
            columns.value = payload.columns;
            payload.action = false;
          }
          break;
        case "search":
          showModal.value.search = false;
          if (payload.action) {
            showModal.value.whereColumns = payload.columns;
          }
        case "sort":
          showModal.value.sort = false;
          if (payload.action) {
            sortedList.value = formHandler.sortBuilder(columns.value);
          }
          break;
        default:
          showModal.value.sort = false;
          break;
      }

      if (payload.action) {
        showModal.value.retrieve = !showModal.value.retrieve;
      }
    };

    return {
      onClick,
      showModal,
      areaTable,
      selectedRow,
      closeModal,
      deletedValues,
      columns,
      sortedList,
      ...store,
    };
  },
});
</script>
<style lang="scss" scoped></style>
