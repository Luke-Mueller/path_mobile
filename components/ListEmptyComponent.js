import React from "react";
import { Text, View } from "react-native";

const ListEmptyComponent = (props) => {
  let text = "You have no lists!";
  if (props.arc) text = "You have no archived lists!";
  if (props.sub) text = "Your sublist has no items!";
  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
};

export default ListEmptyComponent;
