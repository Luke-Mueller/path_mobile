import { Alert } from "react-native";

import { EDITLIST, GETLISTS, POSTLIST } from "../actionCreators";
import { getlists, postlist } from "../../utils/api";

export const editList = (list) => {
  return dispatch => {
    dispatch({
      type: EDITLIST,
      list: list
    })
  }
}

export const getLists = (userId, arr) => {
  return async (dispatch) => {
    try {
      const { lists } = await getlists(userId, arr);
      dispatch({
        type: GETLISTS,
        lists: lists || [],
        arr: arr,
      });
    } catch (error) {
      console.log('listActions.getLists err: ', error)
    }
  };
};

export const postList = (list, userId, navigation) => {
  return async (dispatch) => {
    try {
      const response = await postlist({ list, userId });
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
