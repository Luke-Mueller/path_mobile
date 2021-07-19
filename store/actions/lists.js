import { Alert } from "react-native";

import { POSTLIST } from "../actionCreators";
import { postlist } from "../../utils/api";

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