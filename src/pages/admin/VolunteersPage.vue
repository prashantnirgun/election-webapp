<template>
  <q-page padding>
    <!-- content -->
    <Volunteer />
  </q-page>
</template>

<script>
import Volunteer from "src/components/volunteers/VolunteerList.vue";
export default {
  name: "VolunteersPage",
  components: { Volunteer },
};
</script>
