import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const { height, width } = Dimensions.get("window");

const NewListNameScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 50
      }}
    >
      <Text>Please enter the name of your new list</Text>
      <TextInput
        label="List name"
        onChangeText={(input) => setName(input)}
        style={styles.textInput}
        value={name}
      />
      <Button
        contentStyle={{ flexDirection: "row-reverse" }}
        icon="arrow-right"
        onPress={() => navigation.navigate("New List", { name })}
        style={{ alignSelf: "flex-end" }}
      >
        next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: width / 1.5,
    marginVertical: 25,
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default NewListNameScreen;
