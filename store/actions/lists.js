import { Alert } from "react-native";

import {
  ADDLIST,
  AUTH,
  EDITLIST,
  GETLISTS,
  LOGOUT,
  POSTLIST,
} from "../actionCreators";
import {
  archiveList,
  activatelist,
  editList,
  getlists,
  postlist,
} from "../../utils/api";

export const activateList = (payload, navigation) => {
  return async (dispatch) => {
    try {
      const { list, user } = await activatelist(payload);
      dispatch({
        type: AUTH,
        user,
      });
      navigation.navigate("Started Lists", {
        screen: "Active List",
        params: { arr: "activeLists", listId: list._id },
      });
    } catch (error) {
      console.log("[ERROR: listsActions:16]: await activatelist", error);
    }
  };
};

export const archivelist = (payload, navigation) => {
  return async (dispatch) => {
    try {
      const { list, user } = await archiveList(payload);
      await dispatch({ type: ADDLIST, arr: "archivedLists", list }),
      await dispatch({ type: AUTH, user })
      return { done: true }
    } catch (error) {
      console.log(error);
    }
  };
};

export const editlist = (list, navigation) => {
  return async (dispatch) => {
    try {
      const { returnedList } = await editList(list);
      if (returnedList) {
        dispatch({ type: EDITLIST, returnedList });
        Alert.alert(
          "List Updated...",
          `${returnedList.name} was updated successfully!`,
          [
            {
              onPress: () =>
                navigation.navigate("List", {
                  arr: "myLists",
                  listId: returnedList._id,
                }),
            },
          ]
        );
      }
    } catch (error) {
      console.log("listActions.editist err: ", error);
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
          { onPress: () => navigation.navigate("All Lists") },
        ]);
      }
    } catch (error) {
      console.log("listActions.postList err: ", error);
    }
  };
};
