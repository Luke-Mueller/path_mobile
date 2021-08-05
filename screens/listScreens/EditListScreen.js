import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import { editList } from "../../utils/api";
import Color from "../../constants/color";
import EditModal from "../../components/EditModal";
import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";
import ListItemModel from "../../models/ListItem";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";

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
      let items = list.items;
      items.push(action.newItem);
      return {
        ...list,
        items: items,
      };
    case listActions.CLEARCHANGES:
      return {
        ...action.list,
      };
    case listActions.EDITITEM:
      items = list.items;
      const index = list.items.findIndex(
        (item) => item._id === action.item._id
      );
      items[index] = action.item;
      return {
        ...list,
        items: items,
      };
    case listActions.REMOVEITEM:
      if (action.itemType === "item") {
        return {
          ...list,
          items: list.items.filter((_, index) => index !== action.itemIndex),
        };
      }
      if (action.itemType === "sublist") {
        const newItems = [...list.items[action.listItemIndex].items];
        newItems.splice(action.itemIndex, 1);

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
  const userId = useSelector((state) => state.auth.user._id);
  const userList = useSelector(
    (state) =>
      state.lists[route.params.arr].filter(
        (list) => list._id === route.params.listId
      )[0]
  );
  const lists = useSelector((state) => state.lists);
  const [item, dispatchItem] = useReducer(itemReducer, null);
  const [list, dispatchList] = useReducer(listReducer, { ...userList });
  const [newSubItem, setNewSubItem] = useState(null);

  const dispatch = useDispatch();

  const archiveList = async () => {
    const payload = { listId: list._id, userId };
    const { done } = await dispatch(
      listsActions.archivelist(payload, navigation)
    );
    if (done) {
      navigation.navigate("Archive", {
        screen: "Archived List",
        params: {
          listId: list._id,
          arr: "archivedLists",
        },
      });
      navigation.popToTop();
    }
    // console.log('archiveList')
  };

  const editListHandler = useCallback(async () => {
    dispatch(listsActions.editlist(list, navigation));
  }, [list]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Edit list`,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="edit list"
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
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              multiline={true}
              onChangeText={(input) =>
                dispatchItem({ type: itemActions.ITEM, item: input })
              }
              placeholder="Enter list item"
              placeholderTextColor="#888"
              style={{ ...styles.input, color: "white" }}
              textAlignVertical="top"
              value={item.item}
            />
            <Button
              title="Cancel"
              color="white"
              onPress={() =>
                dispatchItem({ type: itemActions.SETITEM, item: null })
              }
            />
            <Button
              title="Ok"
              color="white"
              onPress={() => {
                dispatchList({
                  type: listActions.EDITITEM,
                  item,
                });

                dispatchItem({ type: itemActions.SETITEM, item: null });
              }}
            />
          </View>
        </Modal>
      )}
      {item && item.itemType === "sublist" && (
        <Modal>
          <View>
            <TextInput
              onChangeText={(input) =>
                dispatchItem({ type: itemActions.SUBNAME, name: input })
              }
              placeholder="Enter sub-list name"
              placeholderTextColor="#888"
              style={{ ...styles.input, color: "white" }}
              textAlignVertical="top"
              value={item.subName}
            />
            <TextInput
              multiline={true}
              onChangeText={(input) => setNewSubItem(input)}
              placeholder="Enter sub-list item"
              placeholderTextColor="#888"
              style={{ ...styles.input, ...{ color: "white" } }}
              textAlignVertical="top"
              value={newSubItem}
            />
            <Feather
              name="plus"
              size={24}
              color="white"
              onPress={() => {
                dispatchItem({
                  type: itemActions.ADDSUBITEM,
                  subItem: newSubItem,
                }),
                  setNewSubItem(null);
              }}
            />
            <FlatList
              data={item.subItems}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.item}>
                  <Text style={{ color: "white" }}>{item}</Text>
                  <Feather
                    name="trash"
                    size={24}
                    color="white"
                    onPress={() =>
                      dispatchItem({ type: itemActions.REMOVESUBITEM, index })
                    }
                  />
                </View>
              )}
            />
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              {/* <Button
                title="Cancel"
                onPress={() => {
                  dispatchList({
                    type: itemActions.SETITEM,
                    list: null,
                  });
                }}
                color="white"
              /> */}
              <Button
                title="Ok"
                onPress={() => {
                  dispatchList({
                    type: listActions.EDITITEM,
                    item,
                  });
                  dispatchItem({ type: itemActions.SETITEM, item: null });
                  setNewSubItem(null);
                }}
                color="white"
              />
            </View>
          </View>
        </Modal>
      )}

      <Button
        title="Clear Changes"
        onPress={() =>
          dispatchList({
            type: listActions.CLEARCHANGES,
            list: { ...userList },
          })
        }
      />

      <TextInput
        onChangeText={(input) =>
          dispatchList({ type: listActions.LISTNAME, name: input })
        }
        placeholder="Enter list name"
        style={styles.input}
        value={list.name}
      />
      <FlatList
        data={list.items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() =>
                dispatchItem({ type: itemActions.SETITEM, item: { ...item } })
              }
            >
              <View style={styles.button}>
                <Text>{item.item ? item.item : item.subName}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="See Lists" onPress={() => console.log("lists: ", lists)} />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => archiveList()}
      >
        <Feather name="archive" size={24} color="black" />
        <Text style={{ marginHorizontal: 25 }}>Archive List</Text>
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
  container_list: {
    flex: 3,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  buttonContainer: {
    backgroundColor: Color.highlight,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 75,
  },
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: Color.black,
    margin: 5,
    minHeight: 50,
    paddingHorizontal: 20,
    width: 250,
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
