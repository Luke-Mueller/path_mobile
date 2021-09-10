import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

const NewListNameScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  return (
    <View
      style={{ flex: 1, alignItems: "center" }}
    >
      <Text>Please enter the name of your new list</Text>
      <TextInput
        label="List name"
        onChangeText={(input) => setName(input)}
        style={{ ...styles.textInput, color: "black" }}
        value={name}
      />
      <Button
        onPress={() => navigation.navigate("New List", { name })}
				// style={{ alignSelf: 'flex-end'}}
      >
        next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: width / 1.5,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default NewListNameScreen;
