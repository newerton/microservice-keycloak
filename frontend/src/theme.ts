import { createMuiTheme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
  type: 'dark',
  primary: {
    main: "#79aec8",
    contrastText: "#fff",
  },
  secondary: {
    main: "#4db5ab",
    contrastText: "#fff",
    dark: "#055a52",
  },
  background: {
    default: "#000",
  },
  success: {
    main: green["500"],
    contrastText: "#fff",
  },
  error: {
    main: red["500"],
  },
};

const theme = createMuiTheme({
  palette,
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "html, body, #root, #root > main": {
          height: "100%",
        },
      },
    },
  },
});

export default theme;
