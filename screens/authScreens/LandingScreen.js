import React from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Headline, Subheading } from "react-native-paper";
import { Foundation } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const screenOptions = () => {
  return { headerShown: false };
};

const AuthScreen = ({ navigation }) => {
  const authHandler = (signup) => {
    if (signup) {
      navigation.navigate("Auth", { signup });
    } else {
      navigation.navigate("Auth");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ marginBottom: 50, marginTop: 25 }}>
          <Foundation
            name="social-path"
            size={60}
            color="white"
            style={{ alignSelf: "flex-start" }}
          />
          <Headline
            style={{
              color: "white",
              fontSize: 35,
              fontWeight: "600",
              lineHeight: 45,
              marginTop: 50
            }}
          >
            Welcome to Path
          </Headline>
          <Subheading style={{ color: "white", fontWeight: "700" }}>
            Easily create, organize, and share the things you want to get done
          </Subheading>
        </View>
        <View style={styles.buttonContainer}>
          <View>
            <Button
              color="#00a8ff"
              style={{ ...styles.button, backgroundColor: "white" }}
              mode="outlined"
              title="Signup"
              onPress={() => authHandler(true)}
            >
              signup
            </Button>
            <Button
              color="white"
              style={styles.button}
              mode="outlined"
              onPress={() => authHandler(false)}
            >
              login
            </Button>
          </View>
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
  button: {
    justifyContent: "center",
    width: width / 1.75,
    height: width / 7.5,
    margin: 5,
    borderColor: "white",
    borderWidth: 2,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00a8ff",
    padding: 40,
  },
});

export default AuthScreen;
