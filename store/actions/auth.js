import { Alert } from "react-native";

import { AUTH, LOGOUT } from "../actionCreators";
import { login, restorelist, signup } from "../../utils/api";

export const logOut = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};

export const logIn = (username) => {
  return async (dispatch) => {
    try {
      const { user } = await login(username);
      if (user) {
        dispatch({
          type: AUTH,
          user: user,
        });
      }
    } catch (error) {
      // ERROR HANDLED IN UTILS/API
      return;
    }
  };
};

export const restoreList = (listId, userId, navigation) => {
  return async (dispatch) => {
    const payload = { listId, userId };
    try {
      const { user } = await restorelist(payload);
      if (user) {
        dispatch({ type: AUTH, user })
      }
      navigation.navigate("All Lists")
    } catch (error) {
      return
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
        `An account for ${returnedUser.user.username} was successfully created!`
      );
      dispatch({
        type: AUTH,
        user: returnedUser.user,
      });
    }
  };
};
