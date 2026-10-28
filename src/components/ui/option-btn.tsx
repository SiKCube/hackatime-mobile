import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"
import StyledText from "./text"

interface Props {
  text: string
  selectedKey: string
  selected: string
  icon: string
  onClick: () => void
  disable: boolean
}

export default function OptionBtn({ text, selectedKey, selected, onClick, icon, disable }: Props) {
  const { themeData } = useTheme()

  return (
    <TouchableOpacity onPress={onClick} disabled={disable}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: selectedKey === selected ? `${themeData.surface_200}` : `${themeData.surface_100}`,
        borderColor: themeData.surface_300,
        opacity: disable ? 0.7 : 1
      }}>
        <Ionicons
          color={selectedKey === selected ? themeData.primary : themeData.secondary}
          name={icon as any} size={17} />
        <StyledText size={13} weight={selectedKey === selected ? "bold" : "normal"}>{text}</StyledText>
      </View>
    </TouchableOpacity>
  )
}