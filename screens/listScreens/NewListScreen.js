import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Divider,
  FAB,
  List,
  Portal,
  TextInput,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../models/ListItem";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";

const { width } = Dimensions.get("window");

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
    default:
      return state;
  }
};

const NewListScreen = ({ navigation, route }) => {
  // FAB STATE
  const [open, setOpen] = useState(false);

  // MODAL STATE
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddListModal, setShowAddListModal] = useState(false);

  const showAddItem = () => setShowAddItemModal(true);
  const showAddList = () => setShowAddListModal(true);

  // ITEM INPUTS STATE
  const [newDetailsInput, setNewDetailsInput] = useState("");
  const [newItemInput, setNewItemInput] = useState("");
  const [newItemInputSub, setNewItemInputSub] = useState("");

  // NEW LIST STATE
  const userId = useSelector((state) => state.auth.user._id);
  const [list, dispatchNL] = useReducer(listReducer, {
    newList: {
      items: [],
      name: route.params.name,
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
          <Item title="save" onPress={saveHandler} />
        </HeaderButtons>
      ),
    });
  }, [navigation, list, saveHandler]);

  const addItem = async (type) => {
    let newItem;
    if (type === "item") {
      newItem = new ListItem(
        type,
        newItemInput.toString(),
        newDetailsInput.toString(),
        null,
        null
      );
      dispatchNL({
        type: listActions.ADDITEM,
        itemType: type,
        item: newItem,
      });
      setNewDetailsInput("");
      setNewItemInput("");
      setShowAddItemModal(false);
    } else if (type === "sublist") {
      newItem = new ListItem(
        type,
        null,
        null,
        list.subList.subName,
        list.subList.subItems
      );
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
    dispatchNL({
      type: listActions.ADDSUBITEM,
      subItem: newItemInputSub.toString(),
    });
    setNewItemInputSub("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {showAddItemModal && (
          <Modal>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TextInput
                label="Item"
                multiline={true}
                onChangeText={setNewItemInput}
                style={{ ...styles.textInput, color: "white" }}
                textAlignVertical="top"
                value={newItemInput}
              />
              <TextInput
                label="Details"
                multiline={true}
                onChangeText={setNewDetailsInput}
                style={{ ...styles.textInput, color: "white" }}
                textAlignVertical="top"
                value={newDetailsInput}
              />
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Button
                  onPress={() => {
                    setShowAddItemModal(false);
                    setNewDetailsInput("");
                    setNewItemInput("");
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={() => addItem("item")}>Ok</Button>
              </View>
            </View>
          </Modal>
        )}
        {showAddListModal && (
          <Modal>
            <View>
              <TextInput
                label="Sub list name"
                onChangeText={(input) =>
                  dispatchNL({ type: listActions.SETSUBNAME, subName: input })
                }
                style={styles.textInput}
                value={list.subList.subName}
              />
              <TextInput
                multiline={true}
                onChangeText={setNewItemInputSub}
                label="Sub list item"
                style={styles.textInput}
                value={newItemInputSub}
                right={
                  <TextInput.Icon name="plus" onPress={() => addSubItem()} />
                }
              />

              <FlatList
                data={list.subList.subItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <List.Item
                    right={() => (
                      <Button
                        icon="trash-can-outline"
                        onPress={() =>
                          dispatchNL({
                            type: "REMOVEITEM",
                            itemType: "sublist",
                            idx: index,
                          })
                        }
                      />
                    )}
                    title={item}
                  />
                )}
              />
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Button
                  onPress={() => {
                    setShowAddListModal(false);
                    setNewItemInputSub("");
                    dispatchNL({ type: listActions.RESETSUB });
                  }}
                >
                  cancel
                </Button>
                <Button onPress={() => addItem("sublist")}>ok</Button>
              </View>
            </View>
          </Modal>
        )}
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? "minus" : "plus"}
            actions={[
              {
                icon: "pencil-plus-outline",
                label: "Add item",
                small: false,
                onPress: showAddItem,
              },
              {
                icon: "playlist-plus",
                label: "Add sub list",
                small: false,
                onPress: showAddList,
              },
            ]}
            onStateChange={({ open }) => setOpen(open)}
            onPress={() => setOpen(!open)}
          />
        </Portal>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FlatList
            data={list.newList.items}
            ItemSeparatorComponent={Divider}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <List.Item
                description={item.details}
                style={styles.item}
                right={(props) => (
                  <Button
                    {...props}
                    icon="trash-can-outline"
                    onPress={() =>
                      dispatchNL({
                        type: "REMOVEITEM",
                        itemType: "item",
                        idx: index,
                      })
                    }
                  />
                )}
                title={item.item ? item.item : item.subName}
              />
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
  },
  textInput: {
    width: width / 1.5,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
    alignSelf: "center",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default NewListScreen;
