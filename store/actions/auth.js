import { Alert } from "react-native";

import { AUTH, LOGOUT } from "../actionCreators";
import {
  acceptlist,
  declinelist,
  deleteuser,
  login,
  restorelist,
  signup,
} from "../../utils/api";

export const acceptList = (payload, navigation) => {
  return async (dispatch) => {
    try {
      const { user } = await acceptlist(payload);
      if (user) {
        dispatch({ type: AUTH, user });
        Alert.alert(
          "List accepted...",
          `You accepted the list, so it has been added to your lists!`,
          [
            {
              onPress: () => navigation.navigate("All Lists"),
            },
          ]
        );
      }
    } catch (error) {
      return;
    }
  };
};

export const declineList = (payload, navigation) => {
  return async (dispatch) => {
    const { user } = await declinelist(payload);
    if (user) {
      dispatch({ type: AUTH, user });
      Alert.alert(
        "List declined...",
        `You did not choose to accept the list, so it has been removed from your invites!`,
        [
          {
            onPress: () => navigation.navigate("All Lists"),
          },
        ]
      );
    }
  };
};

export const deleteUser = (activeArr, archivedArr, listArr, userId) => {
  return async (dispatch) => {
    const done = await deleteuser(activeArr, archivedArr, listArr, userId);
    if (done) dispatch({ type: LOGOUT });
  };
};

export const logOut = (navigation) => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
    navigation.reset({
      index: 0,
      routes: [{ name: "Lists" }],
    });
  };
};

export const logIn = (username, setPressed) => {
  return async (dispatch) => {
    try {
      const { user } = await login(username, setPressed);
      if (user) {
        dispatch({
          type: AUTH,
          user: user,
        });
      }
    } catch (error) {
      setPressed(false);
    }
  };
};

export const restoreList = (payload, navigation) => {
  return async (dispatch) => {
    try {
      const { user } = await restorelist(payload);
      await dispatch({ type: AUTH, user });
      navigation.navigate("All Lists", {screen: "All Lists"});
    } catch (error) {
      return;
    }
  };
};

export const signUp = (user) => {
  return async (dispatch) => {
    const returnedUser = await signup({
      username: user.username,
      password: user.password,
    });

    if (returnedUser) {
      Alert.alert(
        "User Created",
        `An account for ${returnedUser.user.username} was successfully created!`,
        [
          {
            onPress: () => {
              dispatch({
                type: AUTH,
                user: returnedUser.user,
              });
            },
          },
        ]
      );
    }
  };
};
