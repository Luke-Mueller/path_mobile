import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../components/Modal";

import * as authActions from "../store/actions/auth";
import Color from "../constants/color";

const AuthScreen = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pressed, setPressed] = useState(false);

  const dispatch = useDispatch();

  const logIn = () => {
    if (!username) {
      return Alert.alert(
        "Login failed",
        "A username and password are required to login."
      );
    }
    setPressed(true);
    dispatch(authActions.logIn(username, setPressed));
  };

  const signUp = () => {
    if (!username || !password) {
      return Alert.alert(
        "Signup failed",
        "Both a username and password are required to signup."
      );
    }
    const user = {
      username,
      password,
    };
    setPressed(true);
    dispatch(authActions.signUp(user, setPressed));
  };

  if (pressed) {
    return (
      <Modal color="#dff9fb">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#34495e" />
          <Text style={{ paddingTop: 25 }}>Just a sec</Text>
        </View>
      </Modal>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setUsername}
          placeholder="Enter username"
          style={styles.input}
          value={username}
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="Enter password"
          style={styles.input}
          value={password}
        />
        <View style={styles.buttonContainer}>
          <Button title="Signup" onPress={signUp} />
          <Button title="Login" onPress={logIn} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 250,
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 250,
    height: 50,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: Color.black,
  },
});

export default AuthScreen;
