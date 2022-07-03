import * as axiosInstance from "./DataService";

const END_POINT = "users";

export async function signIn(argument) {
  const result = await axiosInstance.post(`authentication`, argument);
  return result;
}

export async function emailExists(argument) {
  try {
    const result = await axiosInstance.find(`common-queries`, {
      controller: "emailExists",
      email: argument,
    });
    return result.data.length > 0 ? true : false;
  } catch (error) {
    return error.response.data.type === "NO_ROWS_FOUND" ? false : true;
  }
}

export async function singUp(argument) {
  const result = await axiosInstance.post(`${END_POINT}`, argument);
  return result;
}

export async function forgotPassword(argument) {
  const result = await axiosInstance.post(`${END_POINT}/forgot-password`, {
    email: argument,
  });
  return result;
}

export async function resetPassowrdCodeValidity(argument) {
  const result = await axiosInstance.find(`${END_POINT}/forgot-password`, {
    resetToken: argument,
  });
  return result;
}

export async function updatePassowrd(id, argument) {
  return await axiosInstance.patch(
    `${END_POINT}/updaet-password/${id}`,
    argument
  );
}

export async function resetPassowrd(id, argument) {
  return await axiosInstance.patch(
    `${END_POINT}/forgot-password/${id}`,
    argument
  );
}

export function logout(id, argument) {
  console.log("logout==>");
  //return axiosInstance.findById(END_POINT, id, argument);
}

export async function startSession(session, webhook) {
  return await axiosInstance.post(`${session}/start-session`, { webhook });
}
