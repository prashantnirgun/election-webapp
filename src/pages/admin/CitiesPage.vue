<template>
  <q-page padding>
    <!-- content -->
    <City />
  </q-page>
</template>

<script>
import City from "src/components/cities/CityList.vue";
export default {
  name: "CitiesPage",
  components: { City },
};
</script>
