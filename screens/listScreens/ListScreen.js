import React, { useContext, useEffect } from "react";
import { FlatList, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListItem from "../../components/ListItem";

const ListScreen = (props) => {
  const { navigation, route } = props;

  const list = useSelector((state) => {
    if (props.arc) {
      return state.list.arcLists.filter(
        (list) => list._id === route.params.listId
      )[0];
    }
    return state.list.lists.filter(
      (list) => list._id === route.params.listId
    )[0];
  }) || { name: "", items: [] };

  let headerRight = () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="edit list"
        iconName="edit-2"
        IconComponent={Feather}
        onPress={() => navigation.navigate("Edit List", { listId: list._id })}
      />
    </HeaderButtons>
  );

  if (props.arc) headerRight = null;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: list.name,
      headerRight: headerRight,
    });
  }, [list, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list.items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </View>
  );
};

export default React.memo(ListScreen);
