import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
  } from "@react-navigation/native";
  import {
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
  } from "react-native-paper";

  export const CombinedDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
    },
    roundness: 0
  };
  
  export const CombinedDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      accent: "#FF4C29",
      backdrop: "#082032",
      background: "#082032",
      card: "#2C394B",
      primary: "#FF4C29",
      surface: "#334756",
      text: "#ccc"
    },
    roundness: 0
  };

  console.log(CombinedDarkTheme)
