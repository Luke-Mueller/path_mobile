import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import { HeaderButtons } from "react-navigation-header-buttons";
import {
  ActivityIndicator,
  Button,
  Headline,
  Text,
  TextInput,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { Foundation } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Modal from "../../components/Modal";

import * as authActions from "../../store/actions/auth";

const { width } = Dimensions.get("window");

const AuthScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    let btnText = "signup";

    if (route.params?.signup) {
      btnText = "login";
    }
    navigation.setOptions({
      title: null,
      headerLeft: null,
      headerStyle: {
        height: 100,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: () => (
        <Foundation
          name="social-path"
          size={45}
          color="#00a8ff"
        />
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Button
            labelStyle={{ fontWeight: "bold" }}
            onPress={changeAuthHandler}
          >
            {btnText}
          </Button>
        </HeaderButtons>
      ),
    });
  });

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

  let text = "Log in";
  let btnText = "login";
  let func = logIn;

  if (route.params?.signup) {
    text = "Sign up";
    btnText = "signup";
    func = signUp;
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
  return (
    <View style={styles.container}>
      <View>
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
        </View>
      </View>
      <KeyboardAvoidingView
        behavior="position"
        style={{
          flex: 1,
          justifyContent: "center",
        }}
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
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 25,
  },
  textInput: {
    width: width - 25,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default AuthScreen;
