import React, { useState } from "react";
import { DefaultTheme } from "@react-navigation/native";
import { FlatList as NativeFlatList } from "react-native";
import { Divider, List, Text } from "react-native-paper";

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
    setItem,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <NativeFlatList
      {...props}
      data={data}
      ItemSeparatorComponent={() => <Divider />}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={blank ? null : ListEmptyComponent}
      renderItem={({ item, index }) => {
        // Lists
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

        // Active list
        if (listType === "activeLists") {
          if (item.itemType === "item") {
            return (
              <List.Accordion
                expanded={false}
                description={item.details}
                descriptionNumberOfLines={1}
                descriptionEllipsizeMode="tail"
                title={item.item}
                onPress={() => (doneHandler ? doneHandler(item._id) : null)}
                left={() =>
                  doneHandler ? (
                    <List.Icon icon="checkbox-blank-outline" />
                  ) : (
                    <List.Icon icon="checkbox-marked-outline" />
                  )
                }
                right={() => null}
              />
            );
          }

          if (item.itemType === "sublist") {
            return (
              <List.Accordion
                expanded={true}
                right={() => null}
                left={(props) =>
                  item.done ? (
                    <List.Icon {...props} icon="checkbox-marked-outline" />
                  ) : (
                    <List.Icon {...props} icon="checkbox-blank-outline" />
                  )
                }
                onPress={() => (doneHandler ? doneHandler(item._id) : null)}
                title={item.subName}
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
              description={item.details}
              descriptionNumberOfLines={1}
              descriptionEllipsizeMode="tail"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="chevron-right-circle-outline"
                  onPress={() => doneHandler(item._id)}
                />
              )}
            />
          );
        }

        // Deals with items
        if (item.itemType === "item") {
          return (
            <List.Accordion
              expanded={false}
              description={item.details}
              descriptionNumberOfLines={1}
              descriptionEllipsizeMode="tail"
              title={item.item}
              onPress={() => setItem(item)}
              left={(props) => (
                <List.Icon {...props} icon="chevron-right-circle-outline" />
              )}
              right={() => null}
            />
          );
        }

        // Deals with sublists
        if (item.itemType === "sublist") {
          return (
            <List.Accordion
              expanded={expanded}
              left={(props) => (
                <List.Icon {...props} icon="chevron-right-circle-outline" />
              )}
              onPress={toggleExpand}
              title={item.subName}
            >
              {item.subItems.map((subItem, index) => (
                <List.Item
                  key={index}
                  onPress={() => setItem(subItem)}
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
