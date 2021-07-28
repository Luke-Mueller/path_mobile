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
import { useSelector } from "react-redux";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import { archiveList, deleteList, editList } from "../../utils/api";
import Color from "../../constants/color";
import EditModal from "../../components/EditModal";
import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";
import ListItemModel from "../../models/ListItem";
import Modal from "../../components/Modal";

const listReducer = (state, action) => {
  switch (action.type) {
    case "addItem":
      let items = state.items;
      items.push(action.newItem);
      return {
        ...state,
        items: items,
      };
    case "cancel":
      return {
        ...action.state,
      };
    case "editItem":
      items = state.items;
      const index = state.items.findIndex((item) => item === action.item);
      items[index] = action.item;
      return {
        ...state,
        items: items,
      };
    case "removeItem":
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
    case "setListName":
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};

const EditListScreen = ({ navigation, route }) => {
  const [item, setItem] = useState({});
  const userList = useSelector(
    (state) =>
      state.list.lists.filter((list) => list._id === route.params.listId)[0]
  );
  const [list, dispatch] = useReducer(listReducer, userList);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);
  const userId = useSelector((state) => state.auth.user.user._id);

  const [subListItem, setSubListItem] = useState("");
  const [subListItems, setSubListItems] = useState([]);
  const [subListName, setSubListName] = useState("");

  const addItemHandler = useCallback(
    (sublist) => {
      if (sublist) {
        const item = new ListItemModel(
          "",
          subListItems,
          subListName,
          "sublist"
        );
        dispatch({ type: "addItem", newItem: item });
        setShowAddListModal(false);
        setSubListItem("");
        setSubListItems([]);
        setSubListName("");
      } else {
        const item = new ListItemModel(newItem, [], "", "item");
        dispatch({ type: "addItem", newItem: item });
        setNewItem();
      }
    },
    [dispatch, newItem, setNewItem, subListItems, subListName]
  );

  const addItemSub = () => {
    const newSubList = subListItems;
    const newSubListItem = { item: subListItem };
    newSubList.push(newSubListItem);
    setSubListItems(newSubList);
    setSubListItem("");
  };

  const archiveListHandler = useCallback(async () => {
    const response = await archiveList({
      list: {
        _id: list._id,
        arcOwnerIds: list.arcOwnerIds,
        ownerIds: list.ownerIds,
      },
      userId: userId,
    });
    if (response.ok) {
      Alert.alert("List Archived", response.message, [
        { onPress: () => navigation.navigate("All Lists") },
      ]);
    }
  }, [list, navigation, userId]);

  const closeModalHandler = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const cancelHandler = useCallback(() => {
    dispatch({ type: "cancel", state: userList });
    setModalVisible(false);
  }, [dispatch, setModalVisible, userList]);

  const deleteHandler = useCallback(async () => {
    const response = await deleteList(list._id, userId);
    if (response.ok) {
      Alert.alert("List Deleted", response.message, [
        { onPress: () => navigation.navigate("All Lists") },
      ]);
    }
  }, [list, navigation, userId]);

  const editItemHandler = useCallback(
    (newItem) => {
      dispatch({ type: "editItem", item: newItem });
    },
    [dispatch]
  );

  const editListHandler = useCallback(async () => {
    const response = await editList(list);
    if (response.list) {
      Alert.alert("List Updated", `${list.name} was updated successfully!`, [
        { onPress: () => navigation.navigate("List", { listId: list._id }) },
      ]);
    }
  }, [list]);

  const openModalHandler = useCallback(
    (item) => {
      setItem(item);
      setModalVisible(true);
    },
    [setItem, setModalVisible]
  );

  const removeItemHandler = useCallback(
    (index, sub, listItemIndex) => {
      const itemType = sub ? "sublist" : "item";
      dispatch({
        type: "removeItem",
        itemIndex: index,
        itemType,
        listItemIndex,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Edit list`,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="edit list"
            IconComponent={MaterialIcons}
            iconName="done"
            onPress={editListHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [editListHandler, list, navigation]);

  return (
    <View style={styles.container}>
      {modalVisible && (
        <EditModal
          closeModal={closeModalHandler}
          editItem={editItemHandler}
          item={item}
          listItems={list.items}
          listItemIndex={list.items.findIndex((i) => i === item)}
          onCancel={cancelHandler}
          removeItem={removeItemHandler}
        />
      )}
      {showAddItemModal && (
        <Modal>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              multiline={true}
              onChangeText={setNewItem}
              placeholder="Enter list item"
              style={styles.input}
              textAlignVertical="top"
              value={newItem}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setNewItem("");
                setShowAddItemModal(false);
              }}
              color="white"
            />
            <Button
              title="Ok"
              onPress={() => {
                addItemHandler();
                setNewItem("");
                setShowAddItemModal(false);
              }}
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
            <Feather name="plus" size={24} color="white" onPress={addItemSub} />
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
                onPress={() => addItemHandler("sublist")}
                color="white"
              />
            </View>
          </View>
        </Modal>
      )}
      <TextInput
        onChangeText={(listName) =>
          dispatch({ type: "setListName", name: listName })
        }
        placeholder="Enter list name"
        style={styles.input}
        value={list.name}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <MaterialIcons
          name="add-task"
          size={40}
          style={{ marginHorizontal: 50, marginVertical: 25 }}
          color={Color.black}
          onPress={() => setShowAddItemModal(true)}
        />
        <MaterialIcons
          name="playlist-add"
          size={40}
          style={{ marginHorizontal: 50, marginVertical: 25 }}
          color={Color.black}
          onPress={() => {
            setItem(""), setShowAddListModal(true);
          }}
        />
      </View>
      <View style={styles.container_list}>
        <FlatList
          data={list.items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ListItem
              editable
              item={item}
              listItemIndex={index}
              openModal={() => openModalHandler(item)}
              removeItem={removeItemHandler}
            />
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => deleteHandler()}
        >
          <Feather name="trash" size={24} color="black" />
          <Text style={{ marginHorizontal: 25 }}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => archiveListHandler()}
        >
          <Feather name="archive" size={24} color="black" />
          <Text style={{ marginHorizontal: 25 }}>Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
