import React, { useState } from "react";
import { DefaultTheme } from "@react-navigation/native";
import { FlatList as NativeFlatList } from "react-native";
import { Divider, List } from "react-native-paper";

import ListEmptyComponent from "./ListEmptyComponent";

const FlatList = (props) => {
  const {
    blank,
    data,
    doneHandler,
    listType,
    longPressHandler,
    navigation,
    path,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <NativeFlatList
      data={data}
      ItemSeparatorComponent={() => <Divider />}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={blank ? null : ListEmptyComponent}
      renderItem={({ item }) => {
        if (listType === "activeLists" && doneHandler) {
          if (item.itemType === "item") {
            return (
              <List.Item
                left={() => <List.Icon icon="circle-outline" />}
                title={item.item}
                onPress={() => doneHandler(item._id)}
              />
            );
          }
          if (item.itemType === "sublist") {
            return (
              <List.Accordion
                expanded={true}
                left={() => <List.Icon icon="circle-outline" />}
                right={() => null}
                onPress={() => doneHandler(item._id)}
                title={item.subName}
                titleStyle={{ color: DefaultTheme.colors.text, opacity: 0.87 }}
              >
                {item.subItems.map((subItem, index) => (
                  <List.Item
                    key={index}
                    title={subItem.item ? subItem.item : subItem}
                    style={{ paddingLeft: 50 }}
                  />
                ))}
              </List.Accordion>
            );
          }
          return (
            <List.Item
              title={item.subName ? item.subName : item.item}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="circle-outline"
                  onPress={() => doneHandler(item._id)}
                />
              )}
            />
          );
        }

        // Deals with lists
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

        // Deals with items
        if (item.itemType === "item") {
          return <List.Item title={item.item} />;
        }

        // Deals with sublists
        if (item.itemType === "sublist") {
          return (
            <List.Accordion
              expanded={expanded}
              onPress={toggleExpand}
              title={item.subName}
              titleStyle={{ color: DefaultTheme.colors.text, opacity: 0.87 }}
            >
              {item.subItems.map((subItem, index) => (
                <List.Item
                  key={index}
                  title={subItem.item ? subItem.item : subItem}
                  style={{ paddingLeft: 50 }}
                />
              ))}
            </List.Accordion>
          );
        }
      }}
    />
  );
};

export default FlatList;
