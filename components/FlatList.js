import React from "react";
import { FlatList as NativeFlatList } from "react-native";
import { Divider, List } from "react-native-paper";

import ListEmptyComponent from "./ListEmptyComponent";

const FlatList = (props) => {
  const { data, listType, longPressHandler, navigation, path } = props;

  return (
    <NativeFlatList
      data={data}
      ItemSeparatorComponent={() => <Divider />}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({ item }) => {
        if (!item.itemType) {
          return (
            <List.Item
              onLongPress={() => longPressHandler(item._id)}
              onPress={() =>
                navigation.navigate(path, {
                  listId: item._id,
                  listType,
                })
              }
              title={item.name}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
            />
          );
        }
        if (item.itemType === "item") {
          return (
            <List.Item
              title={item.item}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
            />
          );
        }
        if (item.itemType === "sublist") {
          return (
            <List.Accordion title={item.subName}>
              {item.subItems.map((subItem) => (
                <List.Item title={subItem} />
              ))}
            </List.Accordion>
          );
        }
      }}
    />
  );
};

export default FlatList;
