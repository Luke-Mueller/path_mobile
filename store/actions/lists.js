import { Alert } from "react-native";

import {
  ADDLIST,
  AUTH,
  DELETELIST,
  EDITLIST,
  GETLISTS,
  LOGOUT,
  POSTLIST,
} from "../actionCreators";
import {
  archiveList,
  activatelist,
  deleteList,
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
      navigation.navigate("Active Lists");
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
        await dispatch({ type: AUTH, user });
      return { done: true };
    } catch (error) {
      console.log(error);
    }
  };
};

export const deletelist = (listId, userId, arr, navigation) => {
  return async (dispatch) => {
    try {
      const { user } = await deleteList(listId, userId, arr);
      let onpress;
      if (user) {
        dispatch({ type: DELETELIST, listId, arr });
        if (arr === "myLists") {
          onpress = () => navigation.navigate("All Lists");
        }
        if (arr === "activeLists") {
          onpress = () =>
            navigation.navigate("Started Lists", { screen: "Active Lists" });
        }
        if (arr === "archivedLists") {
          onpress = () =>
            navigation.navigate("Archive", { screen: "Archived Lists" });
        }

        Alert.alert("List Deleted...", `The list was deleted successfully!`, [
          {
            onPress: () => onpress(),
          },
        ]);
      }
    } catch (error) {
      console.log("[DELETELIST ERROR: ", error);
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
