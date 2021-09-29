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
  roundness: 0,
};

export const CombinedDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    accent: "#F79F1F",
    backdrop: "#082032",
    background: "#082032",
    card: "#2C394B",
    primary: "#F79F1F",
    surface: "#334756",
    text: "#ccc",
  },
  roundness: 0,
};

// console.log("nav dark theme: ", NavigationDarkTheme);
// console.log("paper dark theme: ", PaperDarkTheme);
// console.log("combined dark theme: ", CombinedDarkTheme);
