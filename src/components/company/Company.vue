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
    title="Add Company"
    @close="showModal.add = false"
  >
    <CompanyCreateUpdate
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
    title="Search Company"
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
import Table from "./Table.vue";
import Search from "./Search.vue";
import CompanyCreateUpdate from "./CompanyCreateUpdate.vue";
import BaseVisibleColumn from "../base/BaseVisibleColumn.vue";
import SortColumn from "../base/SortColumn.vue";
import Modal from "../base/Modal.vue";
import useForm from "src/hooks/useForm";
import useService from "src/hooks/useService";
import { companyColumns } from "src/config/tableColumns";
export default defineComponent({
  name: "Index",
  components: {
    Table,
    Search,
    Modal,
    CompanyCreateUpdate,
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
          name: "company_name",
          label: "Company Name",
          widget: "text",
          type: "String",
          values: [],
        },
        {
          name: "state_id",
          widget: "ddlb",
          type: "Number",
          label: "State",
          options: [],
          idCol: "id",
          labelCol: "state_name",
          values: [0],
          condition: null,
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
          name: "is_inventory",
          widget: "select",
          type: "String",
          label: "Inventory",
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
    const companyTable = ref();
    const formHandler = useForm();
    const Company = useService("companies");
    const columns = ref([]);
    const sortedList = ref([]);
    columns.value = companyColumns;

    onMounted(() => {
      sortedList.value = formHandler.sortBuilder(columns.value);
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
          selectedRow.value = companyTable.value.getCurrentRow();
          if (selectedRow.value) {
            showModal.value.add = true;
          }
          break;
        case "Search":
          showModal.value.search = true;
          break;
        case "Delete":
          deletedRow.value = companyTable.value.selected;
          if (deletedRow.value.length > 0) {
            showModal.value.delete = true;
            deletedValues.value = formHandler.deletedList(
              deletedRow.value,
              "company_name"
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
          await Company.remove(deletedRow.value[0].id);
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
      companyTable,
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
