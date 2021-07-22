import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../constants/color";

const ListsItem = ({ list, navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("List", { list })}
      >
        <View style={styles.button}>
          <Text>{list.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 2.5,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ListsItem;
