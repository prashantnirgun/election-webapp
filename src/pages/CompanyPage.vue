<template>
  <q-page>
    <Company />
  </q-page>
</template>

<script>
import Company from "src/components/company/Company.vue";
export default {
  name: "CompanyPage",
  components: {
    Company,
  },
  setup() {
    return {};
  },
};
</script>
