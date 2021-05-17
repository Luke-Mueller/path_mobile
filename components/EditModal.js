import React, { useState } from "react";
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";


import ListEmptyComponent from "../components/ListEmptyComponent";
import ListItem from "../components/ListItem";

const EditModal = (props) => {
  const {
    closeModal,
    editItem,
    item,
    itemIndex,
    listItemIndex,
    listItems,
    onCancel,
    removeItem,
  } = props;
  const [text, setText] = useState(item.item);
  const [name, setName] = useState(item.name);
  const [sublistItem, setSublistItem] = useState("")
  const [sublistItems, setSublistItems] = useState(item.items)

  const addNewSubItem = () => {
    const newItems = sublistItems;
    const newItem = { item: sublistItem }
    newItems.push(newItem);
    setSublistItems(newItems);
    setSublistItem("");
  }

  const removeSubListItem = (index) => {
    const newItems = [...sublistItems]
    newItems.splice(index, 1)
    setSublistItems(newItems);
    removeItem(index, true, listItemIndex)
  }

  const editHandler = () => {
    const newItem = item;
    if (item.itemType === "sublist") {
      newItem.name = name;
    } else {
      newItem.item = text;
    }
    editItem(newItem);
    closeModal();
  };

  let body;

  if (item.itemType === "item") {
    body = (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          multiline={true}
          onChangeText={setText}
          placeholder="Enter list item"
          style={styles.input}
          value={text}
        />
        <Button title="Ok" onPress={() => editHandler()} color="white" />
      </View>
    );
  }

  if (item.itemType === "sublist") {
    body = (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          multiline={true}
          onChangeText={setName}
          placeholder="Enter sublist name"
          style={styles.input}
          value={name}
        />
        <TextInput
          multiline={true}
          onChangeText={setSublistItem}
          placeholder="Enter sub-list item"
          style={styles.input}
          textAlignVertical="top"
          value={sublistItem}
        />
        <Feather name="plus" size={24} color="white" onPress={addNewSubItem} />
        <View>
          <FlatList
            data={sublistItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ListItem
                item={item}
                itemIndex={index}
                listItemIndex={listItemIndex}
                listItems={listItems}
                removeItem={() => removeSubListItem(index)}
                sub
              />
            )}
          />
        </View>
        <Button title="Ok" onPress={() => editHandler()} color="white" />
      </View>
    );
  }

  return (
    <Modal animationType="fade" transparent={true}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {body}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: 350,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: "white",
    margin: 5,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default EditModal;
