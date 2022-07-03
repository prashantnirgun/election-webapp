<template>
  <q-page padding>
    <!-- content -->
    <Voter />
  </q-page>
</template>

<script>
//import { ref } from "vue";
import Voter from "src/components/voters/VoterList.vue";
export default {
  name: "VotersPage",
  components: { Voter },
};
</script>
