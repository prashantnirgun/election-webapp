import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    user: null,
    token: null,
    counter: 0,
    name: "Eduardo",
    isAdmin: true,
    isLoggedIn: false,
  }),

  getters: {
    getUser: (state) => {
      return state.user;
    },
    getUserName: (state) => {
      return state.user ? state.user.full_name : "Guest";
    },
    getCompanyId: (state) => {
      return state.user ? state.user.company_id : 0;
    },
    getToken: (state) => {
      return state.token;
    },
    getUuid: (state) => {
      return state.user ? state.user.uuid : null;
    },
    isUserLoggedIn: (state) => {
      return state.isLoggedIn;
    },
  },

  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        this.isLoggedIn = true;
        console.log("thanks token received", this.isLoggedIn);
      } else {
        this.isLoggedIn = false;
      }
    },

    setUser(payload) {
      console.log("what is setUser", !!payload, this.isLoggedIn);
      if (!!payload) {
        console.log("inside if");
        this.user = payload;
      } else {
        this.user = null;
      }
    },
    setTest(payload) {
      console.log("payload", payload, this.isLoggedIn);
    },
    setImage(image) {
      this.user.image_filename = image;
    },
  },
  persist: true,
});
