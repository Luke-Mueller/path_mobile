// import { Foundation } from "@expo/vector-icons";
//       <Foundation name="social-path" size={45} color="#00a8ff" />

import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Headline,
  Text,
  TextInput,
} from "react-native-paper";
import { Foundation } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import Modal from "../../components/Modal";

import * as authActions from "../../store/actions/auth";

const { width } = Dimensions.get("window");

const AuthScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pressed, setPressed] = useState(false);
  const dispatch = useDispatch();

  const changeAuthHandler = () => {
    const signup = route.params?.signup;
    navigation.navigate("Auth", { signup: !signup });
  };

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

  let text, btnText, func, prompt, promptBtnText;
  if (route.params?.signup) {
    btnText = "signup";
    func = signUp;
    prompt = "Already have an account?";
    promptBtnText = "login";
    text = "Sign up";
  } else {
    btnText = "login";
    func = logIn;
    prompt = "Need to create an account?";
    promptBtnText = "signup";
    text = "Log in";
  }

  let btn = (
    <View>
      <Button
        color="#00a8ff"
        style={styles.button}
        mode="contained"
        onPress={() => func()}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>{btnText}</Text>
      </Button>
    </View>
  );

  if (pressed) {
    return (
      <Modal>
        <View style={styles.contentContainer}>
          <ActivityIndicator color="#34495e" />
          <Text style={{ marginLeft: 20 }}>Logging in...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{...styles.container}}>
      <Foundation name="social-path" size={45} color="#00a8ff" />

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Headline style={{ alignSelf: "flex-start", fontSize: 30, margin: 5 }}>
          {text}
        </Headline>
        <View style={{ marginVertical: 25 }}>
          <TextInput
            autoCapitalize="none"
            label="Username"
            onChangeText={setUsername}
            style={styles.textInput}
            value={username}
          />
          <TextInput
            autoCapitalize="none"
            label="Password"
            onChangeText={setPassword}
            style={styles.textInput}
            value={password}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              margin: 15
            }}
          >
            <Text>{prompt}</Text>
            <Button
              labelStyle={{ fontWeight: "bold" }}
              onPress={changeAuthHandler}
            >
              {promptBtnText}
            </Button>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={
          Platform.OS === "ios"
            ? {
                flex: 1,
                justifyContent: "flex-end",
              }
            : null
        }
      >
        {btn}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    width: width / 2,
    height: width / 7.5,
    margin: 5,
    borderColor: "#00a8ff",
    borderWidth: 2,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 50,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    paddingVertical: 50,
    paddingHorizontal: 80,
  },
  textInput: {
    width: width / 1.5,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default AuthScreen;
