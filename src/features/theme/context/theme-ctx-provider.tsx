import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from "react"
import { CartesianChartPresetInput } from "react-native-chart-kit/v2"
import { Theme, ThemeName } from "./theme"
import THEMES from "./themes.json"
import { defaultChartTheme, useThemeLogic } from "./useThemeLogic"

interface ThemeCtxType {
  theme: ThemeName,
  setTheme: Dispatch<SetStateAction<ThemeName>>
  themeData: Theme,
  chartTheme: CartesianChartPresetInput
}

const ThemeContext = createContext<ThemeCtxType>({
  theme: "classic",
  themeData: THEMES.classic,
  chartTheme: defaultChartTheme,
  setTheme: () => { },
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme, chartTheme, themeData } = useThemeLogic()

  return (
    <ThemeContext.Provider value={{
      theme, chartTheme, themeData, setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
