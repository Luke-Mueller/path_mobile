import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import Color from "../constants/color";

const ListItem = (props) => {
  let buttonGroup = null;
  const { editable, item, listItemIndex, openModal, removeItem, sub } = props;

  if (editable) {
    buttonGroup = (
      <View style={{ flexDirection: "row" }}>
        <Feather
          name="edit-2"
          size={24}
          color="black"
          style={{ marginHorizontal: 20 }}
          onPress={openModal}
        />
        <Feather name="x" size={24} color="black" onPress={() => removeItem(listItemIndex)} />
      </View>
    );
  }

  if (sub) {
    buttonGroup = (
      <View style={{ flexDirection: "row" }}>
        <Feather name="x" size={24} color="white" onPress={() => removeItem()} />
      </View>
    );
  }

  return (
    <View {...props} style={{ ...styles.container, ...props.style }}>
      <Text style={styles.text}>
        {item.name ? item.name : item.item}
      </Text>
      {buttonGroup}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.highlight,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 2.5,
    paddingHorizontal: 10,
  },
  text: {
    flex: 1,
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ListItem;
