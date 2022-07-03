<template>
  <q-page padding>
    <!-- content -->
    <Member />
    <h1>Member</h1>
  </q-page>
</template>

<script>
//import { ref } from "vue";
import Member from "src/components/member/Member.vue";
export default {
  name: "MemberPage",
  components: { Member },
};
</script>
