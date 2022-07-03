<template>
  <q-table
    v-model:pagination="pagination"
    ref="qtable"
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    row-key="id"
    :loading="loading"
    selection="single"
    @request="onRequest"
  >
    <template #top>
      <div class="col-2 q-table__title">City</div>
      <q-space />
      <Action-Buttons @buttonAction="callAction" />

      <q-btn flat round dense icon="list" class="float-right">
        <q-menu anchor="top left" self="top right">
          <q-list style="min-width: 100px" dense>
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Create')"
            >
              <q-item-section>New</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Update')"
            >
              <q-item-section>Edit</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Delete')"
            >
              <q-item-section>Delete</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Search')"
            >
              <q-item-section>Search</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Visible')"
            >
              <q-item-section>Visible</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="$emit('callAction', 'Sort')"
            >
              <q-item-section>Sort</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </q-table>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  reactive,
  computed,
} from "vue";
import useService from "src/hooks/useService";
import useForm from "src/hooks/useForm";
import ActionButtons from "../base/ActionButtons.vue";

export default defineComponent({
  name: "CityTable",
  components: {
    ActionButtons,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    whereCondition: {
      type: Array,
      default: () => [],
    },
    retrieve: {
      type: Boolean,
      default: false,
    },
    sortBy: {
      type: Array,
      default: () => [],
    },
    companyId: {
      type: Number,
    },
  },
  emits: ["callAction"],
  setup(prop, { emit }) {
    const rows = ref([]);
    const selected = ref([]);
    const loading = ref(false);
    const Citys = useService("cities");
    const selectedColumns = reactive(prop.columns);
    const qtable = ref();

    const formHandler = useForm();

    watch(
      () => prop.retrieve,
      () => {
        runRequest();
      }
    );
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    const visibleColumns = computed(() => {
      return prop.columns.filter((row) => row.visible).map((row) => row.field);
    });

    const onRequest = async (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      loading.value = true;

      // fetch data from "server"
      const payload = {
        $skip: (page - 1) * rowsPerPage,
        $limit: rowsPerPage,
        //$joinRelation: "address",
        "$select[]": "*",
      };
      if (prop.sortBy.length > 0) {
        prop.sortBy.map((row) => {
          const key = Object.keys(row);
          payload[key] = row[key];
        });
      }

      const whereCondition = await formHandler.whereBuilder(
        prop.whereCondition
      );
      if (whereCondition.length > 0) {
        whereCondition.map((row) => {
          const key = Object.keys(row);
          payload[key] = row[key];
        });
      }

      payload["company_id"] = prop.companyId;
      //payload["$joinRelation"] = "[user,address.area.city]";
      //console.log("payload", payload, props);
      //const returnedData = await api.countries.find(payload);
      //const Citys = useService("citys");
      const returnedData = await Citys.find(payload);

      // clear out existing data and add new
      rows.value.splice(0, rows.value.length, ...returnedData.data.data);

      // don't forget to update local pagination object
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      // pagination.value.sortBy = sortBy
      // pagination.value.descending = descending
      pagination.value.rowsNumber = returnedData.data.total;

      // ...and turn of loading indicator
      loading.value = false;
    };

    const getCurrentRow = () => {
      return selected.value[0];
    };

    onMounted(() => {
      // get initial data from server (1st page)
      // console.log("route", route.name);
      //headerName.value = route.name;
      runRequest();
    });

    const runRequest = () => {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
    };

    const callAction = (action) => {
      if (action === "SelectAll") {
        qtable.value.toggleFullscreen();
      } else {
        emit("callAction", action);
      }
    };

    return {
      loading,
      pagination,
      prop,
      rows,
      visibleColumns,
      onRequest,
      selected,
      getCurrentRow,
      runRequest,
      selectedColumns,
      qtable,
      callAction,
    };
  },
});
</script>
