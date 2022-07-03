import { AppFullscreen } from "quasar";
import { api } from "src/boot/api";
/*
const params = {
  answer: { toJSON: () => 42 },
  time: moment('2016-06-01')
};
const res = await axios.get('https://httpbin.org/get', { params });
*/
export async function find(route, argument) {
  return await api.get(route, !argument ? {} : { params: argument });
}

export async function findById(route, id, argument) {
  return await api.get(`${route}/${id}`, !argument ? {} : { params: argument });
}

export async function post(route, data) {
  return await api.post(route, data);
}

export async function put(route, data) {
  return await api.put(route, data);
}

export async function patch(route, data) {
  return await api.patch(route, data);
}

export async function remove(route, id) {
  return await api.delete(`${route}/${id}`);
}
