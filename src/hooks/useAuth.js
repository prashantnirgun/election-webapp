import * as auth from "src/services/auth";
import { api } from "src/boot/api";
import { useGlobalStore } from "src/stores/global";

export default () => {
  //const store = useStore();
  const store = useGlobalStore();

  const setAxiosHeaders = (token) => {
    console.log("axios token", token);
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  };

  const setToken = (token) => {
    //store.commit("user/SET_TOKEN", token);
    //store.dispatch("global/setToken", token);
    store.setToken(token);
  };

  const setUser = (user) => {
    //store.commit("global/SET_USER", user);
    console.log("inside setUser", user);
    store.setUser(user);
  };

  const loginRequest = async (email, password) => {
    try {
      const response = await auth.signIn({
        email,
        password,
        strategy: "local",
        //secretkey: process.env.SECRETKEY,
        //session: process.env.SESSION,
      });
      console.log("response", response);
      if (response.data.user) {
        setUser(response.data.user);
        setToken(response.data.accessToken);
        setAxiosHeaders(response.data.accessToken);
      }
      return response.data.user;
    } catch (error) {
      console.log("error==>");
      console.log("error==>", error);
      throw error;
    }
  };

  const logoutRequest = async () => {
    await setUser(null);
    await setToken(null);
    await setAxiosHeaders(null);
  };
  const registerRequest = async (data) => {
    try {
      data.user_status = "Active";
      data.email_verified = "Yes";
      const response = await auth.singUp(data);

      return response.user;
    } catch (error) {
      //console.log("login failed", error);
      throw error;
    }
  };

  const forgotPasswordRequst = async (email) => {
    try {
      const response = await auth.forgotPassword(email);
      return response;
    } catch (error) {
      //console.log("forgot-passowrd", error);
      throw error;
    }
  };

  const emailExists = async (email) => {
    try {
      return await auth.emailExists(email);
    } catch (error) {
      //console.log("forgot-passowrd", error);
      throw error;
    }
  };

  const resetPassowrdCodeValidity = async (forgotCode) => {
    try {
      return await auth.resetPassowrdCodeValidity(forgotCode);
    } catch (error) {
      //console.log("resetPassowrdValidity", error);
      throw error;
    }
  };

  const updatePassowrd = async (id, argument) => {
    try {
      return await auth.updatePassowrd(route, id, argument);
    } catch (error) {
      throw error;
    }
  };

  const resetPassowrd = async (id, argument) => {
    try {
      return await auth.resetPassowrd(id, argument);
    } catch (error) {
      throw error;
    }
  };

  return {
    loginRequest,
    logoutRequest,
    registerRequest,
    forgotPasswordRequst,
    emailExists,
    resetPassowrdCodeValidity,
    updatePassowrd,
    resetPassowrd,
  };
};
