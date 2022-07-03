<template>
  <q-select
    v-model="model"
    outlined
    dense
    :options="lists"
    emit-value
    map-options
    use-input
    hide-selected
    fill-input
    v-bind="$attrs"
    :option-value="properties.idCol"
    :option-label="properties.labelCol"
    @filter="filterFn"
  />
</template>
<script>
import { ref, computed, defineComponent } from "vue";
export default defineComponent({
  name: "InputSelect",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    properties: {
      type: Object,
      default: () => {},
    },
    modelValue: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ["update:model-value"],
  setup(props, { emit }) {
    const lists = ref(props.options);

    const model = computed({
      get: (_) => props.modelValue,
      set: (val) => {
        emit("update:model-value", val);
      },
    });

    const filterFn = (val, update, abort) => {
      update(() => {
        try {
          const needle = val.toLowerCase();
          lists.value = props.options.filter(
            (v) =>
              v[props.properties.labelCol].toLowerCase().indexOf(needle) > -1
          );
        } catch (error) {
          console.log("error", error);
        }
      });
    };
    //const model = ref(null);
    return { model, filterFn, lists };
  },
});
</script>
<style lang="scss" scoped></style>
