import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ArchiveListsScreen, {
  screenOptions as ArchiveListsScreenOptions,
} from "../screens/archiveScreens/ArchiveListsScreen";
import ListScreen from "../screens/listScreens/ListScreen";

const Stack = createStackNavigator();

const ArchiveNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Archive">
      <Stack.Screen
        name="Archive"
        component={ArchiveListsScreen}
        options={ArchiveListsScreenOptions}
      />
      <Stack.Screen name="Archived List" component={ListScreen} arc={true} />
    </Stack.Navigator>
  );
};

export default ArchiveNavigator;
