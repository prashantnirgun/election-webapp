<template>
  <div class="text-green text-bold">{{ row.label }}</div>
  <div class="row q-col-gutter-xs justify-between">
    <q-select
      v-model="condition"
      outlined
      dense
      :options="whereCondition"
      label="Condition"
      class="col-6"
    />

    <Input-Select
      v-if="row.widget === 'ddlb'"
      v-model="modelOne"
      :options="row.options"
      label="Company"
      :properties="row"
      class="col-6"
    />

    <q-input
      v-if="row.widget === 'text'"
      v-model="modelOne"
      outlined
      dense
      :placeholder="row.label"
      class="col-6"
    />

    <q-select
      v-if="row.widget === 'select'"
      v-model="modelOne"
      outlined
      dense
      :options="row.options"
      :options-dense="true"
      :placeholder="row.label"
      class="col-6"
    />
  </div>

  <span v-if="error !== null" class="text-red">
    {{ error }}
  </span>
</template>
<script>
import { defineComponent, ref, computed, watch } from "vue";
import useForm from "src/hooks/useForm";
import InputSelect from "src/components/base/InputSelect.vue";
export default defineComponent({
  name: "WidgetBase",
  components: {
    InputSelect,
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    row: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["updateExpression"],

  setup(props, { emit }) {
    const { booleanConditon, stringConditon, numberConditon, dateConditon } =
      useForm();
    const condition = ref(
      props.row.condition ? props.row.condition : "Select Condition"
    );
    const modelOne = ref(props.row.values.length ? props.row.values[0] : null);
    const modelTwo = ref(
      props.row.values.length > 0 ? props.row.values[1] : null
    );

    const error = ref(null);
    watch([modelOne, modelTwo, condition], () => {
      //console.log("wtch", model);
      buildCondition();
    });

    const whereCondition = computed(() => {
      switch (props.row.widget.toLowerCase()) {
        case "text":
          return stringConditon.value;
          break;
        case "date":
          return dateConditon.value;
          break;
        case "number":
          return numberConditon.value;
          break;
        default:
          return booleanConditon.value;
          break;
      }
    });
    const buildCondition = () => {
      let expression = {};
      error.value = null;
      if (
        modelOne.value == null ||
        modelOne.value === 0 ||
        modelOne.value === "0"
      ) {
        error.value = "Please select the value";
      } else if (condition.value !== "Select Condition") {
        emit("updateExpression", {
          values: [modelOne.value, modelTwo.value],
          condition: condition.value,
        });
      }
    };
    return {
      whereCondition,
      condition,
      modelOne,
      modelTwo,
      buildCondition,
      error,
    };
  },
});
</script>
<style lang="scss" scoped></style>
