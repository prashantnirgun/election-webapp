<template>
  <q-card-section>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="fact_check"
        label="Sort by"
        header-class="text-primary"
      >
        <q-card>
          <q-card-section class="q-pt-none q-pb-sm">
            <draggable
              class="list-group"
              :list="sortedList"
              group="people"
              item-key="row.field"
            >
              <template #item="{ element }">
                <q-banner
                  dense
                  class="bg-secondary q-my-sm shadow-3 cursor-pointer"
                >
                  <q-icon name="pan_tool_alt" color="white" size="sm" />
                  <span class="text-white"> {{ element.label }}</span>
                  <q-toggle
                    v-model="element.order"
                    dense
                    class="float-right"
                    color="white"
                    icon-color="black"
                    checked-icon="keyboard_double_arrow_up"
                    unchecked-icon="keyboard_double_arrow_down"
                    :label="`${element.order ? 'Ascending' : 'Descending'}`"
                  />
                </q-banner>
              </template>
            </draggable>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="list_alt"
        label="Column List"
        header-class="text-green"
        default-opened
      >
        <q-card>
          <q-card-section class="q-pt-none q-pb-sm">
            <draggable
              class="list-group"
              :list="columnList"
              group="people"
              item-key="row.field"
            >
              <template #item="{ element }">
                <q-banner
                  dense
                  class="bg-teal-4 q-my-sm shadow-3 cursor-pointer"
                >
                  <q-icon name="pan_tool_alt" color="white" size="sm" />
                  {{ element.label }}
                  <q-toggle
                    v-model="element.order"
                    dense
                    class="float-right"
                    color="white"
                    icon-color="black"
                    checked-icon="keyboard_double_arrow_up"
                    unchecked-icon="keyboard_double_arrow_down"
                    :label="`${element.order ? 'Ascending' : 'Descending'}`"
                  />
                </q-banner>
              </template>
            </draggable>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-card-section>
  <q-card-section class="row justify-end">
    <q-btn label="Submit" color="yellow-10" class="q-mr-sm" @click="onSubmit" />
    <q-btn
      label="close"
      color="blue-grey-12"
      @click="$emit('close', { action: false })"
    />
  </q-card-section>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "SortColumn",
  components: { draggable },
  props: {
    columns: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const columnList = ref([]);
    const sortedList = ref([]);
    onMounted(() => {
      props.columns.map((row) => {
        if (row.sort) {
          const data = {
            label: row.label,
            name: row.name,
            order: row.sort.order,
          };
          if (row.sort.index >= 0) {
            data.index = row.sort.index;
            sortedList.value.push(data);
          } else {
            columnList.value.push(data);
          }
        }
      });

      sortedList.value.sort((a, b) => a.index - b.index);
      //console.log("list after sorted", sortedList.value);
    });

    const onSubmit = () => {
      props.columns.map((row) => {
        if (row.sort) {
          const name = row.name;
          const index = sortedList.value.findIndex((row) => row.name === name);
          if (index >= 0) {
            row.sort.index = index;
            row.sort.order = sortedList.value[index].order;
          } else {
            delete row.sort.index;
          }
        }
      });
      //console.log("sorted list", props.columns);
      emit("close", { action: true });
    };
    return { onSubmit, columnList, sortedList };
  },
});
</script>
