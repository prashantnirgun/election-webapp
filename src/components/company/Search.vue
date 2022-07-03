<template>
  <q-card-section class="q-py-none">
    <div v-for="row in columnsList" :key="row.name" class="q-my-sm">
      <keep-alive>
        <Widget :row="row" @updateExpression="updateState($event, row)" />
      </keep-alive>
    </div>
  </q-card-section>
  <q-card-section class="row justify-end">
    <q-btn label="Submit" color="green" class="q-mr-sm" @click="onSubmit" />
    <q-btn
      label="close"
      color="orange"
      @click="$emit('close', { action: false })"
    />
  </q-card-section>
</template>
<script>
import { ref, onMounted, defineComponent } from "vue";
import useService from "src/hooks/useService";
import Widget from "src/components/base/Widget.vue";

export default defineComponent({
  name: "Search",
  components: {
    Widget,
  },
  props: {
    columns: {
      type: Array,
      default: () => {},
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const States = useService("states");
    const columnsList = ref([]);
    const isUpdated = ref(false);
    onMounted(async () => {
      const data = await States.find({
        $paginate: false,
        $select: ["id", "state_name"],
      });
      props.columns.map((row) => {
        const data = { ...row };
        columnsList.value.push(data);
      });

      console.log("onmounted", props.columns, columnsList.value);
      columnsList.value[1].options = data.data;
      columnsList.value[1].options.unshift({ id: 0, state_name: "Select Any" });
    });

    const closeM = (value, row) => {
      row.value = value;
      console.log("close ", value, row);
    };
    const updateState = (argument, row) => {
      row.condition = argument.condition;
      isUpdated.value = true;
      row.values = argument.values;
      console.log("condition", argument, row);
    };
    const onSubmit = () => {
      let whereCondition = [];
      console.log("onSubmit", columnsList.value, props.columns);
      /*
      columns.value.map((row) => {
        if (row.condition) {
          // whereCondition +=
          //   whereCondition.length > 0 ? "&" + row.condition : row.condition;
          whereCondition.push(row.condition.expression);
        }
      });
      */
      //console.log("search", whereCondition.length);
      emit("close", {
        action: isUpdated.value,
        columns: columnsList.value,
      });
    };
    return { columnsList, closeM, onSubmit, updateState };
  },
});
</script>
<style lang="scss" scoped></style>
