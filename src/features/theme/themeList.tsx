import THEMES from "@/features/theme/context/themes.json"
import ThemeCard from "./themeCard"

export default function ThemeList() {
  return (
    <>
      {
        Object.values(THEMES).map((theme, i) => <ThemeCard
          {...theme}
          key={i}
        />)
      }
    </>
  )
}