<template>
  <q-page padding>
    <!-- content -->
    <Area />
  </q-page>
</template>

<script>
import Area from "src/components/areas/AreaList.vue";
export default {
  name: "AreasPage",
  components: { Area },
};
</script>
