import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import { useGlobalStore } from "src/stores/global";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  },
});

export default boot(({ app, store, router }) => {
  const global = useGlobalStore(store);
  if (global.getToken) {
    api.defaults.headers.common["Authorization"] = "Bearer " + global.getToken;
    //console.log("api->>token", global.getToken);
  }

  api.interceptors.response.use(
    (res) => {
      //console.log("what is response", res, typeof res.status);
      switch (res.config.method) {
        case "post":
        case "patch":
          if (res.statusText === "OK") {
            Notify.create({
              type: "positive",
              message: "Record updated successfully",
            });
          }
          break;
        case "delete":
          if (res.statusText === "OK") {
            Notify.create({
              type: "negative",
              message: "Record deleted successfully",
            });
          }
          break;
        default:
          break;
      }

      return res;
    },
    (err) => {
      console.log("what is error", err);
      if (err.response.status === 401) {
        /*
        store.commit("global/SET_TOKEN", null);
        */
        Notify.create({
          type: "warning",
          message: "Security token is expired you need to login to continue",
        });
        router.push({ name: "Authentication" });
        throw new Error(`${err.config.url} not found`);
      }
      throw err;
    }
  );

  app.config.globalProperties.$api = api;
});

export { api };
