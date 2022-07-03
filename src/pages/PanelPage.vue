<template>
  <q-page padding>
    <div class="section-title text-center">
      <h3>WINNING PANEL</h3>
    </div>
    <div class="row justify-center">
      <div class="q-pa-xs col-2" v-for="member in members" :key="member.id">
        <q-card>
          <img :src="member.img" />
          <q-card-section>
            <div class="text-h6">{{ member.name }}</div>
            <div class="text-subtitle2">{{ member.designation }}</div>
          </q-card-section>
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "PanelPage",
  setup(props) {
    const members = ref([
      {
        id: 1,
        name: "One",
        img: "/images/team/team-1.jpg",
        contact: "121212",
        popular: 50,
        designation: "Chairman",
      },
      {
        id: 1,
        name: "Two",
        img: "/images/team/team-2.jpg",
        contact: "121212",
        popular: 50,
        designation: "Secretary",
      },
      {
        id: 1,
        name: "Three",
        img: "/images/team/team-3.jpg",
        contact: "121212",
        popular: 50,
        designation: "Committee Member",
      },
      {
        id: 1,
        name: "Four",
        img: "/images/team/team-4.jpg",
        contact: "121212",
        popular: 50,
        designation: "Committee Member",
      },
    ]);

    return { members };
  },
});
</script>

<style scoped>
.section-title h3::before {
  margin: 0 15px 10px 0;
}
.section-title h3::before,
.section-title h3::after {
  content: "";
  width: 50px;
  height: 2px;
  background: #3498db;
  display: inline-block;
  margin: 0 15px 20px 0;
}

*,
::after,
::before {
  box-sizing: border-box;
}
</style>
