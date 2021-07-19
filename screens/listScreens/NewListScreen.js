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

const newListActions = {
  ADDITEM: "ADDITEM",
  REMOVEITEM: "REMOVEITEM",
  SETNAME: "SETNAME",
};

const listReducer = (state, action) => {
  switch (action.type) {
    case newListActions.ADDITEM:
      const addItems = state.items;
      newItems.push(action.item);
      return {
        ...state,
        items: addItems,
      };
    case newListActions.REMOVEITEM:
      const removeItems = state.items.slice(action.idx, 1);
      return {
        ...state,
        items: removeItems,
      };
    case newListActions.SETNAME:
      console.log("action: ", action.name);
      return {
        ...state,
        name: action.name,
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
  const [newList, dispatchNL] = useReducer(listReducer, {
    items: [],
    name: "",
    ownerIds: [userId],
  });

  const dispatch = useDispatch();

  const saveHandler = useCallback(async () => {
    dispatch(listsActions.postList(newList, navigation));
  }, [dispatch, newList]);

  useEffect(() => {
    let title = "New List";
    if (newList.name) title = newList.name;
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
  }, [navigation, newList, saveHandler]);

  const addItem = () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {showAddItemModal && (
          <Modal>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TextInput
                multiline={true}
                onChangeText={setItem}
                placeholder="Enter list item"
                style={styles.input}
                textAlignVertical="top"
                value={item}
              />
              <Button
                title="Cancel"
                onPress={() => setShowAddItemModal(false)}
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
                onChangeText={setSubListName}
                placeholder="Enter sub-list name"
                style={styles.input}
                textAlignVertical="top"
                value={subListName}
              />
              <TextInput
                multiline={true}
                onChangeText={setSubListItem}
                placeholder="Enter sub-list item"
                style={styles.input}
                textAlignVertical="top"
                value={subListItem}
              />
              <Feather
                name="plus"
                size={24}
                color="white"
                onPress={addItemSub}
              />
              {/* <View> */}
              <FlatList
                data={subListItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={{ color: "white" }}>
                      {item.name ? item.name : item.item}
                    </Text>
                  </View>
                )}
              />
              {/* </View> */}
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowAddListModal(false);
                    setSubListItems([]);
                    setSubListItem("");
                    setSubListName("");
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
            dispatchNL({ type: newListActions.SETNAME, name: input });
          }}
          placeholder="Enter list name"
          style={{ ...styles.input, color: "black" }}
          value={newList.name}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="add-task"
            size={40}
            style={{ marginHorizontal: 50, marginVertical: 25 }}
            color={Color.black}
            onPress={() => {
              // setItem("");
              setShowAddItemModal(true);
            }}
          />
          <MaterialIcons
            name="playlist-add"
            size={40}
            style={{ marginHorizontal: 50, marginVertical: 25 }}
            color={Color.black}
            onPress={() => {
              // setItem(""),
              setShowAddListModal(true);
            }}
          />
        </View>
        {/* <View style={styles.listContainer}>
          <FlatList
            data={newList.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item.item ? item.item : item.subName}</Text>
              </View>
            )}
          />
        </View> */}
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
