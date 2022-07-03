<template>
  <q-page class="row">
    <div class="md-5 col q-mx-md">
      <h3 class="">Grow your business<br />with WA-Message</h3>
      <h5>
        We are team of talented designers making<br />websites with Bootstrap
      </h5>
      <q-btn outline rounded color="primary" no-caps label="Get Started" />
    </div>
    <div class="md-7 col justify-end">
      <img src="images\hero-img.png" style="height: 460px; width: 560px" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return {};
  },
});
</script>

<style lang="sass" scoped></style>
