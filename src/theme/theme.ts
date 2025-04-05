// /src/theme/theme.ts
//プロジェクト全体のテーマ設定

import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import {
  amber,
  blue,
  cyan, //追加
  deepOrange, //追加
  green, //追加
  indigo, //追加
  lightBlue, //追加
  lightGreen,
  lime, //追加
  orange, //追加
  pink, //追加
  teal, //追加
  yellow, //追加
} from "@mui/material/colors";

//カラーパレットのカスタマイズの為のスタイルの拡張設定
declare module "@mui/material/styles" {
  interface Palette {
    positiveColor: PaletteColor;
    negativeColor: PaletteColor;
    daysColor: PaletteColor;
    positiveCategoryColor: Record<string, string>; //追加
    negativeCategoryColor: Record<string, string>; //追加
  }
  interface PaletteOptions {
    positiveColor?: PaletteColorOptions;
    negativeColor?: PaletteColorOptions;
    daysColor?: PaletteColorOptions;
    positiveCategoryColor?: Record<string, string>; //追加
    negativeCategoryColor?: Record<string, string>; //追加
  }
}

export const theme = createTheme({
  typography: {
    //fontの定義
    fontFamily:
      'Meiryo,メイリオ,Noto Sans JP, Roboto, "Helbetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  palette: {
    //ポジティブカラーの定義
    positiveColor: {
      main: amber[300], //#ffd54f
      light: amber[50], //#fff8e1
      dark: amber["A700"], //#ffab00
    },
    //ネガティブカラーの定義
    negativeColor: {
      main: blue[100], //#bbdefb
      light: blue[50], //#e3f2fd
      dark: blue[300], //#64b5f6
    },
    //日数カラーの定義
    daysColor: {
      main: lightGreen[200], //#c5e1a5
      light: lightGreen[50], //#f1f8e9
      dark: lightGreen[300], //#aed581
    },
    //追加:CalendarChat用positiveカテゴリカラーの定義
    positiveCategoryColor: {
      pink: pink[500], //#e91e63
      deepOrange: deepOrange[500], //#f44336
      orange: orange[500], //#ff9800
      yellow: yellow[700], //#fdd835
      lime: lime[500], //#cddc39
      lightGreen: lightGreen[500], //#8bc34a
    },
    //追加:CalendarChat用negativeカテゴリカラーの定義
    negativeCategoryColor: {
      indigo: indigo[600], //#f44336
      blue: blue[700], //#ff5722
      lightBlue: lightBlue[500], //#ff9800
      cyan: cyan[500], //#ffc107
      teal: teal[500], //#fdd835
      green: green[500], //#cddc39
    },

    //primaryの変更
    primary: {
      main: lightGreen[500], // primaryカラー
      light: lightGreen[200],
      dark: lightGreen[700],
      contrastText: "#fff", // テキストカラー
    },
  },
});
