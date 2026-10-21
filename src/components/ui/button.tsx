import { Dispatch } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { THEME } from "../theme"

interface Props {
  children?: React.ReactNode
  text?: string
  onClick?: Dispatch<any>
  type: "primary" | "secondary"
  disable?: boolean
}

export default function StyledButton({ children, onClick, text, type, disable }: Props) {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disable}
    >
      <View style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingStart: 16,
        paddingEnd: 16,
        borderRadius: 8,
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: type === "primary" ? THEME.primary : THEME.secondary
      }}>
        {children}
        {
          text && <Text style={{
            fontWeight: "bold",
            color: type === "primary" ? THEME.on_primary : THEME.dark
          }}>{text}</Text>
        }
      </View>
    </TouchableOpacity>
  )
}