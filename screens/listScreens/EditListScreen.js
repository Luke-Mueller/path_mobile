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
  EDITITEM: "EDITITEM",
  LISTNAME: "LISTNAME",
  REMOVEITEM: "REMOVEITEM",
};

const listReducer = (state, action) => {
  switch (action.type) {
    case listActions.ADDITEM:
      let items = state.items;
      items.push(action.newItem);
      return {
        ...state,
        items: items,
      };
    case listActions.EDITITEM:
      items = state.items;
      const index = state.items.findIndex((item) => item === action.item);
      items[index] = action.item;
      return {
        ...state,
        items: items,
      };
    case listActions.REMOVEITEM:
      if (action.itemType === "item") {
        return {
          ...state,
          items: state.items.filter((_, index) => index !== action.itemIndex),
        };
      }
      if (action.itemType === "sublist") {
        const newItems = [...state.items[action.listItemIndex].items];
        newItems.splice(action.itemIndex, 1);

        items = state.items;
        items[action.listItemIndex].items = newItems;
        return {
          ...state,
          items: items,
        };
      }
    case listActions.LISTNAME:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};

const EditListScreen = ({ navigation, route }) => {
  const userList = route.params.list;
  const [item, setItem] = useState(null);
  const [list, dispatchList] = useReducer(listReducer, userList);

  const userId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();

  const archiveList = async () => {
    const payload = { listId: list._id, userId };
    const done = dispatch(listsActions.archivelist(payload, navigation));
    if (done) navigation.pop();
  };

  // const editListHandler = useCallback(async () => {
  //   const response = await editList(list);
  //   if (response.list) {
  //     Alert.alert("List Updated", `${list.name} was updated successfully!`, [
  //       { onPress: () => navigation.navigate("List", { listId: list._id }) },
  //     ]);
  //   }
  // }, [list]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Edit list`,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="edit list"
            IconComponent={MaterialIcons}
            iconName="done"
            onPress={() => console.log("editting list")}
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
              onChangeText={(input) => console.log(input)}
              placeholder="Enter list item"
              placeholderTextColor="#888"
              style={{ ...styles.input, color: "white" }}
              textAlignVertical="top"
              value={item.item}
            />
            <Button
              title="Cancel"
              color="white"
              onPress={() => setItem(null)}
            />
            <Button title="Ok" color="white" onPress={() => addItem("item")} />
          </View>
        </Modal>
      )}
      {item && item.itemType === "sublist" && (
        <Modal>
          <View>
            <TextInput
              onChangeText={(input) =>
                dispatchNL({ type: listActions.SETSUBNAME, subName: input })
              }
              placeholder="Enter sub-list name"
              placeholderTextColor="#888"
              style={styles.input}
              textAlignVertical="top"
              value={list.subList.subName}
            />
            <TextInput
              multiline={true}
              onChangeText={setNewItemInputSub}
              placeholder="Enter sub-list item"
              placeholderTextColor="#888"
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
                  <Text style={{ color: "white" }}>{item}</Text>
                  <Feather
                    name="trash"
                    size={24}
                    color="white"
                    onPress={() =>
                      dispatchNL({
                        type: "REMOVEITEM",
                        itemType: "sublist",
                        idx: index,
                      })
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
        onChangeText={(input) =>
          dispatch({ type: listActions.LISTNAME, name: input })
        }
        placeholder="Enter list name"
        style={styles.input}
        value={list.name}
      />
      <FlatList
        data={list.items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => setItem(item)}>
              <View style={styles.button}>
                <Text>{item.item ? item.item : item.subName}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="See List" onPress={() => console.log("list: ", list)} />
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
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
  },
});

export default EditListScreen;
