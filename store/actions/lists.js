import { Alert } from "react-native";

import { POSTLIST } from "../actionCreators";
import { getlists, postlist } from "../../utils/api";

export const getLists = (arr) => {
  return async (dispatch) => {
    const response = await getlists(arr);
  }
}

export const postList = (list, navigation) => {
  return async (dispatch) => {
    try {
      const response = await postlist(list);
      if (response.ok) {
        Alert.alert(
          "List Saved",
          response.message,
          [{ onPress: () => navigation.navigate("My Lists") }]
        );
        dispatch({
          type: POSTLIST,
          list: response.list,
        });
      }
    } catch (error) {
      console.log('listActions.postList err: ', error)
    }
  };
};
