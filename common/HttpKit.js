import axios from "axios";

import { deferred } from "@/lib/utils";

let client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const defer = new deferred();
let clientIsAuthenticated = false;

const setClientToken = (token) => {
  try {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    clientIsAuthenticated = true;
    defer.resolve(client);
  } catch (error) {
    console.log("Error from setClientToken", error);
    defer.reject(error);
  }
  return defer.promise;
};

const removeClientToken = () => {
  try {
    delete client.defaults.headers.common["Authorization"];
    clientIsAuthenticated = false;
    defer.reject("Token removed");
  } catch (error) {
    console.log("Error from removeClientToken", error);
    defer.reject(error);
  }
  return defer.promise;
};

const HttpKit = {
  defer,
  client,
  setClientToken,
  removeClientToken,
};

export default HttpKit;
