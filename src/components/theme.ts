import { createChartPreset } from "react-native-chart-kit/v2"

export const THEME = {
  on_primary: "#13160d",
  input: "#050505",
  darker: "#050505",
  dark: "#101312",
  darkless: "#242a28",
  red: "#ff4d6d",
  orange: "#ffb347",
  yellow: "#ffd166",
  green: "#7dfc6a",
  cyan: "#6fd7ff",
  blue: "#69a6ff",
  purple: "#c9a8ff",
  primary: "#d7ff6a",
  secondary: "#a4b0aa",
  muted: "#8f9b95",
  text_muted: "#8f9b95",
  surface: "#111514",
  surface_100: "#171c1a",
  surface_200: "#202826",
  surface_300: "#2b3532",
  surface_content: "#e8eee9",
  info: "#6fd7ff",
  success: "#7dfc6a",
  warning: "#ffd166",
  danger: "#ff4d6d",
}

export const neon = createChartPreset({
  background: `${THEME.surface_100}4d`,
  plotBackground: "#ffffff00",
  grid: THEME.surface_300,
  axis: THEME.on_primary,
  series: [THEME.primary, THEME.orange, THEME.blue, THEME.cyan, THEME.blue, THEME.green, THEME.purple, THEME.yellow],
  text: THEME.surface_content,
  tooltip: {
    background: THEME.surface_100,
    border: THEME.secondary,
    text: THEME.surface_content,
  },
  mutedText: THEME.secondary,
  typography: {
    legendLabelSize: 10,
    axisLabelSize: 10
  }
})
