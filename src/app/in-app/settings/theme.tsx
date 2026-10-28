import ThemeList from "@/features/theme/themeList";
import { ScrollView } from "react-native";

export default function Themes() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
      <ThemeList />
    </ScrollView>
  )
}