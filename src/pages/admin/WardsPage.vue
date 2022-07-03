<template>
  <q-page padding>
    <!-- content -->
    <Ward />
  </q-page>
</template>

<script>
import Ward from "src/components/wards/WardList.vue";
export default {
  name: "WardsPage",
  components: { Ward },
};
</script>
