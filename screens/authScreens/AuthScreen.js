import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Headline,
  Text,
  TextInput,
} from "react-native-paper";
import { useDispatch } from "react-redux";

import Modal from "../../components/Modal";

import * as authActions from "../../store/actions/auth";
import { CombinedDarkTheme } from "../../utils/themes";

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
    promptBtnText = "log in";
    text = "Sign up";
  } else {
    btnText = "login";
    func = logIn;
    prompt = "Need to create an account?";
    promptBtnText = "sign up";
    text = "Log in";
  }

  let btn = (
    // <View>
    <Button style={styles.button} mode="contained" onPress={() => func()}>
      {btnText}
    </Button>
    // </View>
  );

  if (pressed) {
    return (
      <Modal>
        <Card
          style={{
            width: width * 0.8,
            height: width * 0.8 * 0.62,
            alignSelf: "center",
          }}
        >
          <Card.Content style={styles.contentContainer}>
            <ActivityIndicator color={CombinedDarkTheme.colors.accent} />
            <Text style={{ marginLeft: 20 }}>Logging in...</Text>
          </Card.Content>
        </Card>
      </Modal>
    );
  }

  return (
    <Pressable
      style={{ flex: 1, paddingTop: 110, paddingLeft: 20 }}
      onPress={Keyboard.dismiss}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 50,
            }}
          >
            <Headline style={{ fontSize: 30 }}>{text}</Headline>
          </View>
          <View style={{ marginVertical: 5 }}>
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
                // alignSelf: "center",
                // margin: 15,
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
                  justifyContent: "center",
                }
              : null
          }
        >
          {btn}
        </KeyboardAvoidingView>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    justifyContent: "center",
    width: width / 2,
    height: width / 7.5,
    margin: 5,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // paddingVertical: 50,
    // paddingHorizontal: 80,
    width: width * 0.8,
    height: width * 0.8 * 0.62,
  },
  textInput: {
    width: width / 1.5,
    // margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default AuthScreen;
