import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import Color from '../../constants/color';

import HeaderButton from "../../components/HeaderButton";

const ListScreen = (props) => {
  const { navigation, route } = props;

  const list = route.params.list;

  let headerRight = () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="edit list"
        iconName="edit-2"
        IconComponent={Feather}
        // onPress={() => navigation.navigate("Edit List", { listId: list._id })}
        onPress={() => console.log("entering edit list")}
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
    <View style={{flex: 1}}>
      {!!list.items.length && (
        <FlatList
          data={list.items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Text style={styles.text}>{item.item ? item.item : item.subName}</Text>
              {!!item.subName && (
                <FlatList
                  data={item.subItems}
                  keyExtractor={(_, idx) => idx.toString()}
                  renderItem={({ item }) => <Text>{item}</Text>}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.highlight,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 2.5,
    paddingHorizontal: 10,
  },
  text: {
    flex: 1,
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default React.memo(ListScreen);
