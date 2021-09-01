import React from "react";
import { Image, Text, View } from "react-native";

const ListEmptyComponent = (props) => {
  let text = "You have no lists!";
  if (props.arc) text = "You have no archived lists!";
  if (props.sub) text = "Your sublist has no items!";
  return (
    <View style={{flex: 1, alignItems: "center", paddingTop: '48%'}}>
      <Image
        style={{ height: 50, width: 50, marginBottom: 20 }}
        source={require("../assets/box.png")}
      />
      <Text>{text}</Text>
    </View>
  );
};

export default ListEmptyComponent;
