import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../constants/color";

const ListsItem = ({ arr, listId, path, navigation }) => {
  const userList = useSelector(
    (state) => state.lists[arr].filter((list) => list._id === listId)[0]
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(path, { listId: userList._id, arr })}
      >
        <View style={styles.button}>
          <Text>{userList.name}</Text>
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
