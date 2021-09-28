import React, { useContext, useState } from "react";
import {
  Dimensions,
  FlatList as NativeFlatList,
  StyleSheet,
  View,
} from "react-native";
import { Card, List } from "react-native-paper";

import { PreferencesContext } from "../utils/context";
import { CombinedDarkTheme, CombinedDefaultTheme } from "../utils/themes";

// import ListEmptyComponent from "./ListEmptyComponent";

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

  const { isThemeDark } = useContext(PreferencesContext);

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const accordionStyles = {
    backgroundColor: isThemeDark
      ? CombinedDarkTheme.colors.surface
      : CombinedDefaultTheme.colors.surface,
    borderRadius: CombinedDefaultTheme.roundness,
  };

  return (
    <NativeFlatList
      {...props}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => {
        // Lists
        if (!item.itemType) {
          return (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <List.Item
                  onLongPress={() => longPressHandler(item._id)}
                  onPress={() =>
                    navigation.navigate(path, {
                      listId: item._id,
                      listType,
                    })
                  }
                  underlayColor="rgba(255, 76, 41, .3)"
                  title={item.name}
                  titleStyle={{ letterSpacing: 1.25 }}
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
              <Card style={styles.card} key={index}>
                <Card.Content style={styles.cardContent}>
                  <List.Accordion
                    style={accordionStyles}
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
                </Card.Content>
              </Card>
            );
          }

          if (item.itemType === "sublist") {
            return (
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <List.Accordion
                    style={accordionStyles}
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
                        titleStyle={{ letterSpacing: 1.25 }}
                        title={subItem.item ? subItem.item : subItem}
                        style={{ paddingLeft: 0 }}
                      />
                    ))}
                  </List.Accordion>
                </Card.Content>
              </Card>
            );
          }
        }

        // Deals with items
        if (item.itemType === "item") {
          return (
            <Card style={styles.card} key={index}>
              <Card.Content style={styles.cardContent}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: CombinedDarkTheme.colors.accent,
                  }}
                >
                  <List.Accordion
                    style={accordionStyles}
                    expanded={false}
                    description={item.details}
                    descriptionEllipsizeMode="tail"
                    descriptionNumberOfLines={1}
                    descriptionStyle={{ letterSpacing: 1.25 }}
                    title={item.item}
                    titleStyle={{ letterSpacing: 1.25, marginBottom: 2 }}
                    onPress={() => setItem(item)}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="chevron-right-circle-outline"
                      />
                    )}
                    right={() => null}
                  />
                </View>
              </Card.Content>
            </Card>
          );
        }

        // Deals with sublists
        if (item.itemType === "sublist") {
          return (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <List.Accordion
                  style={accordionStyles}
                  expanded={expanded}
                  left={(props) => (
                    <List.Icon {...props} icon="chevron-right-circle-outline" />
                  )}
                  onPress={toggleExpand}
                  titleStyle={{ letterSpacing: 1.25 }}
                  title={item.subName}
                >
                  {item.subItems.map((subItem, index) => (
                    <View key={index} style={{ paddingLeft: 0 }}>
                    <List.Item
                      
                      onPress={() => setItem(subItem)}
                      title={subItem.item ? subItem.item : subItem}
                      titleStyle={{ letterSpacing: 1.25 }}
                      descriptionStyle={{ borderRadius: 10 }}
                      style={{ paddingLeft: 0 }}
                    />
                    </View>
                  ))}
                </List.Accordion>
              </Card.Content>
            </Card>
          );
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    alignSelf: "center",
    marginVertical: 2,
  },
  cardContent: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export default FlatList;
