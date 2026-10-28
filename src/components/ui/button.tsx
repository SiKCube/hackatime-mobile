import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { Dispatch } from "react"
import { Text, TouchableOpacity, View } from "react-native"

interface Props {
  children?: React.ReactNode
  text?: string
  onClick?: Dispatch<any>
  type: "primary" | "secondary" | "error"
  disable?: boolean
}

export default function StyledButton({ children, onClick, text, type, disable }: Props) {
  const { themeData } = useTheme()

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
        backgroundColor: type === "primary" ? themeData.primary : type === "secondary" ? themeData.secondary : themeData.danger
      }}>
        {children}
        {
          text && <Text style={{
            fontWeight: "bold",
            color: type === "primary" ? themeData.on_primary : themeData.dark
          }}>{text}</Text>
        }
      </View>
    </TouchableOpacity>
  )
}