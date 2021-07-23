import { Alert } from "react-native";
import { API_BASE_URL } from "../constants/http";

const request = async (args) => {
  if (!args.headers) args.headers = { "Content-Type": "application/json" };
  try {
    const response = await fetch(args.url, args);
    const data = await response.json();
    if (!response.ok) {
      return Alert.alert(data.title, data.message);
    }
    return data;
  } catch (err) {
    console.log("Request err: ", err);
    Alert.alert(
      "Request not completed...",
      "The server is not connected.  Try again later."
    );
  }
};

export const activatelist = (payload) => {
  return request({
    url: `${API_BASE_URL}/user/activateList`,
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const archiveList = (payload) => {
  return request({
    url: `${API_BASE_URL}/lists/archiveList`,
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteList = (listId, userId) => {
  return request({
    url: `${API_BASE_URL}/lists/deleteList/${listId}/${userId}`,
    method: "DELETE",
  });
};

export const editList = (list) => {
  return request({
    url: `${API_BASE_URL}/lists/editList`,
    method: "PUT",
    body: JSON.stringify(list),
  });
};

export const getlists = (arr) => {
  if (!arr.length) arr = "none";

  return request({
    url: `${API_BASE_URL}/lists/getLists/${arr}`,
    method: "GET",
  });
};

export const login = (userName) => {
  return request({
    url: `${API_BASE_URL}/user/login/${userName}`,
    method: "GET",
  });
};

export const postlist = (payload) => {
  return request({
    url: `${API_BASE_URL}/lists/postList`,
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const signup = (payload) => {
  return request({
    url: `${API_BASE_URL}/user/signup`,
    method: "POST",
    body: JSON.stringify(payload),
  });
};
