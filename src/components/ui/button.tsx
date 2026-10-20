import { Dispatch } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { THEME } from "../theme"

interface Props {
  children: React.ReactNode
  onClick: Dispatch<any>
}

export default function StyledButton({ children, onClick }: Props) {
  return (
    <TouchableOpacity
      onPress={onClick}
    >
      <View style={{ padding: 10, backgroundColor: THEME.secondary, borderRadius: 16 }}>
        {children}
      </View>
    </TouchableOpacity>
  )
}