<template>
  <div>
    <apexchart
      width="500"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "DashbaordPage",
  components: {
    apexchart: VueApexCharts,
  },
  //props : {}
  //emits:[''],
  setup(/* props, { emit } */) {
    const state = reactive({
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 35, 50, 49, 60, 70, 91],
        },
      ],
    });
    return { ...toRefs(state) };
  },
};
</script>
<style lang="scss" scoped></style>
