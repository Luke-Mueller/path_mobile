import { Alert } from "react-native";

import {
  ACTIVATELIST,
  AUTH,
  GETLISTS,
  LOGOUT,
  POSTLIST,
} from "../actionCreators";
import { activatelist, getlists, postlist } from "../../utils/api";

export const activateList = (payload, navigation) => {
  return async (dispatch) => {
    try {
      const { list, user } = await activatelist(payload);
      dispatch({
        type: AUTH,
        user,
      });
      navigation.navigate("Active Lists", {
        screen: "Active List",
        params: { list: list },
      });
    } catch (error) {
      console.log("[ERROR: listsActions:16]: await activatelist", error);
    }
  };
};

export const getLists = (arr, arrType) => {
  return async (dispatch) => {
    const response = await getlists(arr, arrType);
    dispatch({ type: GETLISTS, arrType, lists: response.lists });
  };
};

export const logOut = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};

export const postList = (list, navigation) => {
  return async (dispatch) => {
    try {
      const response = await postlist(list);
      if (response.ok) {
        await dispatch({
          type: POSTLIST,
          list: response.list,
        });
        Alert.alert("List Saved", response.message, [
          { onPress: () => navigation.navigate("My Lists") },
        ]);
      }
    } catch (error) {
      console.log("listActions.postList err: ", error);
    }
  };
};
