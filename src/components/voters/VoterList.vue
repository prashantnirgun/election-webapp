<template>
  <q-page>
    <Table
      ref="companyTable"
      :columns="columns"
      :where-condition="showModal.whereColumns"
      :retrieve="showModal.retrieve"
      :sort-by="sortedList"
      class="q-mx-sm"
      @callAction="onClick"
    />
  </q-page>
  <Modal
    :show="showModal.add"
    icon="add"
    title="Add Voter"
    @close="showModal.add = false"
  >
    <VoterCreateUpdate
      :current-row="selectedRow"
      @close="closeModal($event, 'add')"
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
    title="Search Voter"
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
import { onMounted, toRefs, ref, computed, isRef, defineComponent } from "vue";
import Table from "./VoterTable.vue";
import Search from "./VoterSearch.vue";
import VoterCreateUpdate from "./VoterCreateUpdate.vue";
import BaseVisibleColumn from "../base/BaseVisibleColumn.vue";
import SortColumn from "../base/SortColumn.vue";
import Modal from "../base/Modal.vue";
import useForm from "src/hooks/useForm";
import useService from "src/hooks/useService";
import { voterColumns } from "src/config/tableColumns";
export default defineComponent({
  name: "VoterList",
  components: {
    Table,
    Search,
    Modal,
    VoterCreateUpdate,
    BaseVisibleColumn,
    SortColumn,
  },
  setup() {
    const showModal = ref({
      add: false,
      delete: false,
      visible: false,
      search: false,
      fullScreen: false,
      whereColumns: [
        {
          name: "voter_name",
          label: "Voter Name",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "voter_name_marathi",
          label: "सभासदाचे नाव",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "domain",
          label: "Domain",
          widget: "text",
          type: "String",
          condition: null,
          values: [],
        },
        {
          name: "category",
          widget: "select",
          type: "String",
          label: "Category",
          options: ["Yes", "No"],
          condition: null,
          values: [],
        },
      ],
      retrieve: false,
      sort: false,
    });

    const deletedValues = ref(null);
    const selectedRow = ref([]);
    const deletedRow = ref([]);
    const voterTable = ref();
    const formHandler = useForm();
    const Voter = useService("voter");
    const columns = ref([]);
    const sortedList = ref([]);
    columns.value = voterColumns;

    onMounted(() => {
      sortedList.value = formHandler.sortBuilder(columns.value);
      console.log("columns", sortedList.value);
    });
    //console.log("columns", columns);
    const onClick = async (action) => {
      console.log("action", action);
      switch (action) {
        case "Create":
          selectedRow.value = null;
          showModal.value.add = true;
          break;
        case "Update":
          selectedRow.value = voterTable.value.getCurrentRow();
          if (selectedRow.value) {
            showModal.value.add = true;
          }
          break;
        case "Search":
          showModal.value.search = true;
          break;
        case "Delete":
          deletedRow.value = voterTable.value.selected;
          if (deletedRow.value.length > 0) {
            showModal.value.delete = true;
            deletedValues.value = formHandler.deletedList(
              deletedRow.value,
              "voter_name"
            );
            console.log("deleted list", deletedValues.value);
          }
          break;
        case "SelectAll":
          showModal.value.fullScreen = !showModal.value.fullScreen;
          console.log("fullscreen", showModal.value.fullScreen);
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
      //console.log("closemodal", modalName);
      switch (modalName) {
        case "delete":
          showModal.value.delete = false;
          await Voter.remove(deletedRow.value[0].id);
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
      voterTable,
      selectedRow,
      closeModal,
      deletedValues,
      columns,
      sortedList,
    };
  },
});
</script>
<style lang="scss" scoped></style>
