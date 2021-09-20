import React, { useCallback, useEffect, useReducer, useState } from "react";
import { DefaultTheme } from "@react-navigation/native";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Button, Divider, FAB, List, Portal, Text, TextInput } from "react-native-paper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import Color from "../../constants/color";
import HeaderButton from "../../components/HeaderButton";
import ListItemModel from "../../models/ListItem";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";

const { width } = Dimensions.get("window");

const listActions = {
  ADDITEM: "ADDITEM",
  CLEARCHANGES: "CLEARCHANGES",
  EDITITEM: "EDITITEM",
  LISTNAME: "LISTNAME",
  REMOVEITEM: "REMOVEITEM",
};

const listReducer = (list, action) => {
  switch (action.type) {
    case listActions.ADDITEM:
      let items = [...list.items];
      items.push(action.item);
      return {
        ...list,
        items: items,
      };
    case listActions.CLEARCHANGES:
      return {
        ...action.list,
      };
    case listActions.EDITITEM:
      items = [...list.items];
      items[action.index] = action.item;
      return {
        ...list,
        items: items,
      };
    case listActions.REMOVEITEM:
      if (action.itemType === "item") {
        return {
          ...list,
          items: list.items.filter((_, index) => index !== action.index),
        };
      }
      if (action.itemType === "sublist") {
        const newItems = [...list.items[action.listItemIndex].items];
        newItems.splice(action.index, 1);

        items = list.items;
        items[action.listItemIndex].items = newItems;
        return {
          ...list,
          items: items,
        };
      }
    case listActions.LISTNAME:
      return {
        ...list,
        name: action.name,
      };
    default:
      return list;
  }
};

const itemActions = {
  ADDSUBITEM: "ADDSUBITEM",
  DETAILS: "DETAILS",
  ITEM: "ITEM",
  SUBNAME: "SUBNAME",
  REMOVESUBITEM: "REMOVESUBITEM",
  SETITEM: "SETITEM",
};

const itemReducer = (item, action) => {
  switch (action.type) {
    case itemActions.ADDSUBITEM:
      const addSubItems = item.subItems;
      addSubItems.push(action.subItem);
      return {
        ...item,
        subItems: addSubItems,
      };
      case itemActions.DETAILS:
        return {
          ...item,
          details: action.details
        }
    case itemActions.ITEM:
      return {
        ...item,
        item: action.item,
      };

    case itemActions.REMOVESUBITEM:
      const removeSubItems = item.subItems;
      removeSubItems.splice(action.index, 1);
      return {
        ...item,
        subItems: removeSubItems,
      };
    case itemActions.SETITEM:
      const newItem = { ...action.item };
      return {
        ...newItem,
      };
    case itemActions.SUBNAME:
      return {
        ...item,
        subName: action.name,
      };
    default:
      return item;
  }
};

const EditListScreen = ({ navigation, route }) => {
  const userList = useSelector(
    (state) =>
      state.lists[route.params.arr].filter(
        (list) => list._id === route.params.listId
      )[0]
  );
  const [item, dispatchItem] = useReducer(itemReducer, null);
  const [list, dispatchList] = useReducer(listReducer, { ...userList });
  const [expanded, setExpanded] = useState(false);
  const [newSubItem, setNewSubItem] = useState(null);
  const [itemIndex, setItemIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const addTask = () => {
    const newItem = new ListItemModel("item", "", "", []);
    newItem.new = true;
    dispatchItem({
      type: itemActions.SETITEM,
      item: newItem,
    });
    setItemIndex(list.items.length);
  };

  const addList = () => {
    const newItem = new ListItemModel("sublist", "", "", []);
    newItem.new = true;
    dispatchItem({
      type: itemActions.SETITEM,
      item: newItem,
    });
    setItemIndex(list.items.length);
  };

  const editListHandler = useCallback(async () => {
    dispatch(listsActions.editlist(list, "lists", navigation));
  }, [list]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Edit list`,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="undo"
            IconComponent={MaterialIcons}
            iconName="undo"
            onPress={() =>
              dispatchList({
                type: listActions.CLEARCHANGES,
                list: { ...userList },
              })
            }
          />
          <Item
            title="save"
            IconComponent={MaterialIcons}
            iconName="done"
            onPress={() => editListHandler()}
          />
        </HeaderButtons>
      ),
    });
  }, [list, navigation]);

  return (
    <View style={styles.container}>
      {item && item.itemType === "item" && (
        <Modal>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              label="List item"
              multiline={true}
              onChangeText={(input) =>
                dispatchItem({ type: itemActions.ITEM, item: input })
              }
              style={styles.textInput}
              value={item.item}
            />
            <TextInput
              label="List details"
              multiline={true}
              onChangeText={(input) =>
                dispatchItem({ type: itemActions.DETAILS, details: input })
              }
              style={styles.textInput}
              value={item.details}
            />
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Button
                onPress={() => {
                  dispatchItem({ type: itemActions.SETITEM, item: null });
                  setItemIndex(null);
                }}
              >
                cancel
              </Button>
              <Button
                onPress={async () => {
                  const newItem = { ...item };
                  delete newItem.new;
                  await dispatchList({
                    type: item.new ? listActions.ADDITEM : listActions.EDITITEM,
                    item: newItem,
                    index: itemIndex,
                  });
                  await dispatchItem({ type: itemActions.SETITEM, item: null });
                  setItemIndex(null);
                }}
              >
                ok
              </Button>
            </View>
          </View>
        </Modal>
      )}
      {item && item.itemType === "sublist" && (
        <Modal>
          <View>
            <TextInput
              label="List name"
              onChangeText={(input) =>
                dispatchItem({ type: itemActions.SUBNAME, name: input })
              }
              style={styles.textInput}
              value={item.subName}
            />
            <TextInput
              multiline={true}
              onChangeText={(input) => setNewSubItem(input)}
              label="New item"
              style={styles.textInput}
              value={newSubItem}
              right={
                <TextInput.Icon
                  name="plus"
                  onPress={() => {
                    dispatchItem({
                      type: itemActions.ADDSUBITEM,
                      subItem: newSubItem,
                    }),
                      setNewSubItem(null);
                  }}
                />
              }
            />
            <FlatList
              data={item.subItems}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <List.Item
                  right={() => (
                    <Button
                      icon="trash-can-outline"
                      onPress={() =>
                        dispatchItem({ type: itemActions.REMOVESUBITEM, index })
                      }
                    />
                  )}
                  title={item}
                />
              )}
            />
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              {item && item.itemType === "sublist" && item.new && (
                <Button
                  onPress={() => {
                    dispatchItem({ type: itemActions.SETITEM, item: null });
                    setItemIndex(null);
                    setNewSubItem(null);
                  }}
                >
                  cancel
                </Button>
              )}
              <Button
                onPress={() => {
                  const newItem = { ...item, new: undefined };
                  dispatchList({
                    type: item.new ? listActions.ADDITEM : listActions.EDITITEM,
                    item: newItem,
                    index: itemIndex,
                  });
                  dispatchItem({ type: itemActions.SETITEM, item: null });
                  setItemIndex(null);
                  setNewSubItem(null);
                }}
              >
                ok
              </Button>
            </View>
          </View>
        </Modal>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 25
        }}
      >
      <Portal>
        <FAB.Group
          style={{ flex: 1 }}
          open={open}
          icon={open ? "minus" : "plus"}
          actions={[
            {
              icon: "plus",
              label: "Add item",
              small: false,
              onPress: addTask,
            },
            {
              icon: "playlist-plus",
              label: "Add sub list",
              small: false,
              onPress: addList,
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          onPress={() => setOpen(!open)}
        />
      </Portal>
      <TextInput
        onChangeText={(input) =>
          dispatchList({ type: listActions.LISTNAME, name: input })
        }
        label="List name"
        style={styles.textInput}
        value={list.name}
      />
      </View>
      <FlatList
        data={list.items}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={<Text>List Items: </Text>}
        renderItem={({ item, index }) => {
          if (item.itemType === "item") {
            return (
              <List.Item
                description={item.details}
                onPress={() => {
                  dispatchItem({
                    type: itemActions.SETITEM,
                    item: { ...item },
                  });
                  setItemIndex(index);
                }}
                right={() => (
                  <Button
                    icon="trash-can-outline"
                    onPress={() =>
                      dispatchList({
                        type: listActions.REMOVEITEM,
                        index,
                        itemType: "item",
                      })
                    }
                  />
                )}
                title={item.item ? item.item : item.subName}
              />
            );
          }
          if (item.itemType === "sublist") {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <List.Accordion
                  expanded={true}
                  onPress={() => {
                    dispatchItem({
                      type: itemActions.SETITEM,
                      item: { ...item },
                    });
                    setItemIndex(index);
                  }}
                  right={() => null}
                  titleStyle={{
                    color: DefaultTheme.colors.text,
                    opacity: 0.87,
                  }}
                  title={item.subName}
                  style={{ minWidth: "78%" }}
                >
                  {item.subItems.map((subItem, index) => (
                    <List.Item
                      title={subItem.item ? subItem.item : subItem}
                      key={index}
                      style={{ paddingLeft: 50 }}
                    />
                  ))}
                </List.Accordion>
                <Button
                  icon="trash-can-outline"
                  onPress={() =>
                    dispatchList({
                      type: listActions.REMOVEITEM,
                      index,
                      itemType: "item",
                    })
                  }
                  style={{
                    minWidth: "21.25%",
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 10,
                  }}
                />
              </View>
            );
          }
        }}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.highlight,
    padding: 20,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: Color.highlight,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "black",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    maxHeight: 75,
  },
  textInput: {
    width: width / 1.5,
    margin: 5,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
  },
});

export default EditListScreen;
