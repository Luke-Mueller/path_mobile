import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../models/ListItem";
import Modal from "../../components/Modal";

import Color from "../../constants/color";
import * as listsActions from "../../store/actions/lists";

const listActions = {
  ADDITEM: "ADDITEM",
  ADDSUBITEM: "ADDSUBITEM",
  REMOVEITEM: "REMOVEITEM",
  RESETSUB: "RESETSUB",
  SETNAME: "SETNAME",
  SETSUBNAME: "SETSUBNAME",
};

const listReducer = (state, action) => {
  switch (action.type) {
    case listActions.ADDITEM:
      const addItems = state.newList.items;
      addItems.push(action.item);
      return {
        ...state,
        newList: {
          ...state.newList,
          items: addItems,
        },
      };
    case listActions.ADDSUBITEM:
      const newSubItems = state.subList.subItems;
      newSubItems.push(action.subItem);
      return {
        ...state,
        subList: {
          ...state.subList,
          subItems: newSubItems,
        },
      };
    case listActions.REMOVEITEM:      
      let removeItems;
      if (action.itemType === "item") {
        removeItems = state.newList.items;
        removeItems.splice(action.idx, 1);
        return {
          ...state,
          newList: {
            ...state.newList,
            items: removeItems,
          },
        };
      } else if (action.itemType === "sublist") {
        removeItems = state.subList.subItems;
        removeItems.splice(action.idx, 1);
        return {
          ...state,
          subList: {
            ...state.subList,
            subItems: removeItems,
          },
        };
      }
    case listActions.RESETSUB:
      return {
        ...state,
        subList: {
          subName: "",
          subItems: [],
        },
      };
    case listActions.SETSUBNAME:
      return {
        ...state,
        subList: {
          ...state.subList,
          subName: action.subName,
        },
      };
    case listActions.SETNAME:
      return {
        ...state,
        newList: {
          ...state.newList,
          name: action.name,
        },
      };
    default:
      return state;
  }
};

const NewListScreen = ({ navigation }) => {
  // MODAL STATE
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);

  // ITEM INPUTS STATE
  const [newItemInput, setNewItemInput] = useState("");
  const [newItemInputSub, setNewItemInputSub] = useState("");

  // NEW LIST STATE
  const userId = useSelector((state) => state.auth.user._id);
  const [list, dispatchNL] = useReducer(listReducer, {
    newList: {
      items: [],
      name: "",
      ownerIds: [userId],
    },
    subList: {
      subName: "",
      subItems: [],
    },
  });

  const dispatch = useDispatch();

  const saveHandler = useCallback(() => {
    dispatch(listsActions.postList(list.newList, navigation));
  }, [dispatch, list, navigation]);

  useEffect(() => {
    let title = "New List";
    if (list.newList.name) title = list.newList.name;
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="save list"
            IconComponent={MaterialIcons}
            iconName="done"
            onPress={saveHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, list, saveHandler]);

  const addItem = async (type) => {
    let newItem;
    if (type === "item") {
      newItem = new ListItem(type, newItemInput.toString(), null, null);
      dispatchNL({
        type: listActions.ADDITEM,
        itemType: type,
        item: newItem,
      });
      setNewItemInput("");
      setShowAddItemModal(false);
    } else if (type === "sublist") {
      newItem = new ListItem(
        type,
        null,
        list.subList.subName,
        list.subList.subItems
      );
      // DO NOT REMOVE THE AWAIT KEYWORD
      await dispatchNL({
        type: listActions.ADDITEM,
        itemType: type,
        item: newItem,
      });
      dispatchNL({ type: listActions.RESETSUB });
      setNewItemInputSub("");
      setShowAddListModal(false);
    }
  };

  const addSubItem = () => {
    dispatchNL({ type: listActions.ADDSUBITEM, subItem: newItemInputSub.toString() });
    setNewItemInputSub("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {showAddItemModal && (
          <Modal>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TextInput
                multiline={true}
                onChangeText={setNewItemInput}
                placeholder="Enter list item"
                style={styles.input}
                textAlignVertical="top"
                value={newItemInput}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddItemModal(false);
                  setNewItemInput("");
                }}
                color="white"
              />
              <Button
                title="Ok"
                onPress={() => addItem("item")}
                color="white"
              />
            </View>
          </Modal>
        )}
        {showAddListModal && (
          <Modal>
            <View>
              <TextInput
                onChangeText={(input) =>
                  dispatchNL({ type: listActions.SETSUBNAME, subName: input })
                }
                placeholder="Enter sub-list name"
                style={styles.input}
                textAlignVertical="top"
                value={list.subList.subName}
              />
              <TextInput
                multiline={true}
                onChangeText={setNewItemInputSub}
                placeholder="Enter sub-list item"
                style={styles.input}
                textAlignVertical="top"
                value={newItemInputSub}
              />
              <Feather
                name="plus"
                size={24}
                color="white"
                onPress={() => addSubItem()}
              />
              <FlatList
                data={list.subList.subItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.item}>
                    <Text style={{ color: "white" }}>
                      {item}
                    </Text>
                    <Feather
                      name="trash"
                      size={24}
                      color="white"
                      onPress={() =>
                        dispatchNL({ type: "REMOVEITEM", itemType: "sublist", idx: index })
                      }
                    />
                  </View>
                )}
              />
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowAddListModal(false);
                    setNewItemInputSub("");
                    dispatchNL({ type: listActions.RESETSUB });
                  }}
                  color="white"
                />
                <Button
                  title="Ok"
                  onPress={() => addItem("sublist")}
                  color="white"
                />
              </View>
            </View>
          </Modal>
        )}
        <TextInput
          onChangeText={(input) => {
            dispatchNL({ type: listActions.SETNAME, name: input });
          }}
          placeholder="Enter list name"
          style={{ ...styles.input, color: "black" }}
          value={list.newList.name}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="add-task"
            size={40}
            style={{ marginHorizontal: 50, marginVertical: 25 }}
            color={Color.black}
            onPress={() => {
              setShowAddItemModal(true);
            }}
          />
          <MaterialIcons
            name="playlist-add"
            size={40}
            style={{ marginHorizontal: 50, marginVertical: 25 }}
            color={Color.black}
            onPress={() => {
              setShowAddListModal(true);
            }}
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={list.newList.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text>{item.item ? item.item : item.subName}</Text>
                <Feather
                      name="trash"
                      size={24}
                      color="black"
                      onPress={() =>
                        dispatchNL({ type: "REMOVEITEM", itemType: "item", idx: index })
                      }
                    />
              </View>
            )}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 250,
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  input: {
    width: 250,
    minHeight: 50,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: "white",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    // width: "100%",
  },
});

export default NewListScreen;
