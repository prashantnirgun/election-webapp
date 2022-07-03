<template>
  <div class="row">
    <div v-for="row in selectedColumns" :key="row.field">
      <q-toggle
        v-if="!row.required"
        v-model="row.visible"
        class="col-6 col-sm-12"
        :label="row.label"
      />
    </div>
  </div>

  <!-- <div>selected : {{ selectedColumns }}</div> -->
  <q-card-section class="row justify-end">
    <q-btn label="Submit" color="green" class="q-mr-sm" @click="updateState" />
    <q-btn
      label="close"
      color="orange"
      @click="$emit('close', { action: false })"
    />
  </q-card-section>
</template>

<script>
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "BaseVisibleColumn",
  props: {
    columns: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["close"],
  setup(prop, { emit }) {
    const selectedColumns = ref([]);

    onMounted(() => {
      let data = {};

      prop.columns.map((row) => {
        data = {
          name: row.name,
          required: row.required,
          label: row.label,
          align: row.align,
          field: row.field,
          sortable: row.sortable,
          visible: row.visible,
        };
        selectedColumns.value.push({ ...row });
      });
    });

    const updateState = async () => {
      //  unref(selectedColumns);
      emit("close", { action: true, columns: selectedColumns.value });
    };

    return { selectedColumns, updateState };
  },
});
</script>
