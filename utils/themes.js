import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
  } from "@react-navigation/native";
  import {
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
  } from "react-native-paper";

  export const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors,
      accent: "#3BBA9C",
    },
    roundness: 8
  };
  
  export const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      ...NavigationDarkTheme.colors,
      primary: "#3BBA9C",
      accent: "#3BBA9C",
      surface: "#121212"
    },
    roundness: 8
  };