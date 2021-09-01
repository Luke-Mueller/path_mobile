import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const CustomModal = (props) => {
  return (
    <Modal animationType="fade" transparent={true}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: props.color || "rgba(0,0,0,0.8)",
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {props.children}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: 350,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: "white",
    margin: 5,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default CustomModal;
