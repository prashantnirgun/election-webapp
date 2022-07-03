import { boot } from "quasar/wrappers";
import axios from "axios";
//import { useGlobalStore } from "src/stores/global";
// import Countries from "src/api/countries";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const axiosInstance = axios.create({ baseURL: process.env.API_URL });

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  /*
  const global = useGlobalStore(store);
  if (global.getToken) {
    axiosInstance.defaults.headers.common["Authorization"] =
      "Bearer " + global.getToken;
    console.log("axios->>token", global.getToken);
  }
  */
  app.config.globalProperties.$axios = axiosInstance;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  // const factories = {
  //   countries: Countries(api),
  // };
  //app.config.globalProperties.$api = api;
  //console.log("inside", api);
  //app.config.globalProperties.$api = axios;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

//export { axios, api };
export { axiosInstance };
