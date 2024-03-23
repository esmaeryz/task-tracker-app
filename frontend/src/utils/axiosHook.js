import axios from "axios";

const BASE_URL = process.env.VUE_APP_BACKEND_URL;
// I created an axios instance with the base url
// so that I don't have to give a url on each request
const api = axios.create({
  baseURL: BASE_URL,
});

const axiosHook = async (method, task) => {
  let axiosOptions = {};
  if (method === "GET") {
    // on get I don't need any other option than the method
    axiosOptions = {
      method,
    };
  } else if (method === "POST") {
    // on post, I send the task data
    axiosOptions = {
      method,
      data: task,
    };
  } else if (method === "DELETE") {
    // on delete, I send the task id to delete as a query parameter
    axiosOptions = {
      url: `${BASE_URL}/${task.id}`,
      method,
    };
  } else if (method === "PUT") {
    // on put, I send the task id to update as a query parameter
    // and the task data to update the task that has the id that was sent
    axiosOptions = {
      url: `${BASE_URL}/${task.id}`,
      method,
      data: task,
    };
  }

  const res = await api(axiosOptions)
    .then((res) => {
      if (res?.data && res?.data?.tasks) {
        return res.data.tasks;
      }
    })
    .catch((err) => {
      console.error("err", err);
    })
    .finally(() => {
      console.log("Request made");
    });

  return res;
};

export default axiosHook;
