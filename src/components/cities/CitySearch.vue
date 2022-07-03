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
import Widget from "src/components/base/Widget.vue";

export default defineComponent({
  name: "CitySearch",
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
    //const States = useService("states");
    const columnsList = ref([]);
    const isUpdated = ref(false);
    onMounted(async () => {
      props.columns.map((row) => {
        const data = { ...row };
        columnsList.value.push(data);
      });
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
