import { Alert } from "react-native";

import { GETLISTS, POSTLIST } from "../actionCreators";
import { getlists, postlist } from "../../utils/api";

export const getLists = (arr, arrType) => {
  return async (dispatch) => {
    const { lists } = await getlists(arr);
    dispatch({ type: GETLISTS, arrType, lists });
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
