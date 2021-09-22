import React, { useState } from "react";
import { Dimensions, FlatList as NativeFlatList } from "react-native";
import { Card, List } from "react-native-paper";

import ListEmptyComponent from "./ListEmptyComponent";

const { width } = Dimensions.get("screen");

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
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={blank ? null : ListEmptyComponent}
      renderItem={({ item, index }) => {
        // Lists
        if (!item.itemType) {
          return (
            <Card
              onLongPress={() => longPressHandler(item._id)}
              onPress={() =>
                navigation.navigate(path, {
                  listId: item._id,
                  listType,
                })
              }
              style={{ width: width * 0.9, alignSelf: "center", marginVertical: 2 }}
            >
              <Card.Content
                style={{
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
              >
                <List.Item
                  title={item.name}
                  right={(props) => <List.Icon {...props} icon="arrow-right" />}
                />
              </Card.Content>
            </Card>
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
