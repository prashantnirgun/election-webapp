<template>
  <q-page padding>
    <div class="section-title text-center">
      <h3>Meet The Volunteers</h3>
    </div>
    <div class="row justify-center">
      <div
        class="q-pa-xs col-2"
        v-for="(member, index) in members"
        :key="member.id"
      >
        <q-card>
          <img
            :src="`https://avatars.dicebear.com/api/micah/${member.name}.svg`"
          />
          <q-card-section>
            <div class="text-h6">{{ member.name }}</div>
            <div class="text-subtitle2">
              {{ member.telephone }}{{ index + 40 }}
            </div>
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
  name: "Panel",
  setup(props) {
    const members = ref([
      {
        id: 1,
        name: "One",
        popular: 50,
        telephone: "9820XXXX",
      },
      {
        id: 1,
        name: "Two",
        popular: 50,
        telephone: "9820XXXX",
      },
      {
        id: 1,
        name: "Three",
        popular: 50,
        telephone: "9820XXXX",
      },
      {
        id: 1,
        name: "Four",
        popular: 50,
        telephone: "9820XXXX",
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
  margin: 0 15px 20px 15px;
}

*,
::after,
::before {
  box-sizing: border-box;
}
</style>
