import { Alert } from "react-native";

import { AUTH, LOGOUT } from "../actionCreators";
import { login, signup } from "../../utils/api";

export const logOut = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};

export const logIn = (username) => {
  return async (dispatch) => {
    const { user } = await login(username);
    if (user) {
      dispatch({
        type: AUTH,
        user: user,
      });
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
