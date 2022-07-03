import * as DataServices from "./DataService";
const END_POINT = "countries";

export function find(argument) {
  return DataServices.find(END_POINT, argument);
}

export function findById(id, argument) {
  return DataServices.findById(END_POINT, id, argument);
}
