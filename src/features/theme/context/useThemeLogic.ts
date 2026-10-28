import { useEffect, useState } from "react";
import { CartesianChartPresetInput, createChartPreset } from "react-native-chart-kit/v2";
import { STORE_KEYS } from "../../../../consts";
import { getStoredData, storeData } from "../../storage";
import { Theme, ThemeName } from "./theme";
import THEMES from "./themes.json";

export const defaultChartTheme = createChartPreset({
  background: `${THEMES.classic.surface_100}4d`,
  plotBackground: "#ffffff00",
  grid: THEMES.classic.surface_300,
  axis: THEMES.classic.on_primary,
  series: [
    THEMES.classic.primary,
    THEMES.classic.orange,
    THEMES.classic.blue,
    THEMES.classic.cyan,
    THEMES.classic.blue,
    THEMES.classic.green,
    THEMES.classic.purple,
    THEMES.classic.yellow
  ],
  text: THEMES.classic.surface_content,
  tooltip: {
    background: THEMES.classic.surface_100,
    border: THEMES.classic.secondary,
    text: THEMES.classic.surface_content,
  },
  mutedText: THEMES.classic.secondary,
  typography: {
    legendLabelSize: 10,
    axisLabelSize: 10
  }
})

export function useThemeLogic() {
  const [theme, setTheme] = useState<ThemeName>("classic")
  const [themeData, setThemeData] = useState<Theme>(THEMES.classic)

  const [chartTheme, setChartTheme] = useState<CartesianChartPresetInput>(defaultChartTheme)

  const updatecharttheme = (selectedTheme: Theme) => {
    const chartTheme = createChartPreset({
      background: `${selectedTheme.surface_100}4d`,
      plotBackground: "#ffffff00",
      grid: selectedTheme.surface_300,
      axis: selectedTheme.on_primary,
      series: [
        selectedTheme.primary,
        themeData.orange,
        themeData.blue,
        themeData.cyan,
        themeData.blue,
        themeData.green,
        themeData.purple,
        themeData.yellow
      ],
      text: selectedTheme.surface_content,
      tooltip: {
        background: selectedTheme.surface_100,
        border: selectedTheme.secondary,
        text: selectedTheme.surface_content,
      },
      mutedText: selectedTheme.secondary,
      typography: {
        legendLabelSize: 10,
        axisLabelSize: 10
      }
    })

    setChartTheme(chartTheme)
  }

  const storeThemeState = async () => {
    await storeData(STORE_KEYS.theme, theme)
  }

  useEffect(() => {
    (async () => {
      const storedTheme = await getStoredData(STORE_KEYS.theme) as ThemeName | null

      setTheme(storedTheme ? storedTheme : "classic")
      setThemeData(storedTheme ? THEMES[theme] : THEMES["classic"])
      updatecharttheme(THEMES[theme])
    })()
  }, [])
  useEffect(() => {
    storeThemeState()
    setThemeData(THEMES[theme])
    updatecharttheme(THEMES[theme])
  }, [theme])

  return { theme, setTheme, chartTheme, themeData }
}