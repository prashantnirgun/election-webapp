<template>
  <div>
    <q-list>
      <div v-for="item in options" :key="item.label">
        <q-expansion-item
          v-if="item.children"
          :icon="item.icon"
          :label="item.label"
          expand-icon="arrow_circle_down"
          expanded-icon="arrow_circle_up"
          group="somegroup"
          header-class="text-green"
          @click="handleClick"
        >
          <Sidebar :options="item.children" class="q-ml-lg" />
        </q-expansion-item>
        <q-item v-else clickable :to="item.to">
          <q-item-section avatar>
            <q-icon color="primary" :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Sidebar",
  props: {
    options: {
      type: Object,
      required: true,
    },
    minSidebar: {
      type: Boolean,
    },
  },
  emits: ["expandBar"],
  setup(props, { emit }) {
    const handleClick = () => {
      if (props.minSidebar) {
        emit("expandBar");
      }
    };
    return { ...props, handleClick };
  },
});
</script>

<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0
</style>
