import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"
import { THEME } from "../theme"
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
        backgroundColor: selectedKey === selected ? `${THEME.surface_200}` : `${THEME.surface_100}`,
        borderColor: THEME.surface_300,
        opacity: disable ? 0.7 : 1
      }}>
        <Ionicons
          color={selectedKey === selected ? THEME.primary : THEME.secondary}
          name={icon as any} size={17} />
        <StyledText size={13} weight={selectedKey === selected ? "bold" : "normal"}>{text}</StyledText>
      </View>
    </TouchableOpacity>
  )
}