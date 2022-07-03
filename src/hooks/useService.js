import * as DataServices from "src/services/DataService";

export default (endPoint) => {
  const find = (argument) => {
    return DataServices.find(endPoint, argument);
  };

  const findById = (id, argument) => {
    return DataServices.findById(endPoint, id, argument);
  };

  const insert = (argument) => {
    return DataServices.post(endPoint, argument);
  };

  const update = (id, argument) => {
    //console.log("endpoint", endPoint, "id", id, "arguemnt", argument);
    return DataServices.patch(`${endPoint}/${id}`, argument);
  };

  const remove = (id) => {
    return DataServices.remove(endPoint, id);
  };
  return { find, findById, insert, update, remove };
};
