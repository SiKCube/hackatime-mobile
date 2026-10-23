import { Text } from "react-native"
import { THEME } from "../theme"

interface Props {
  children: React.ReactNode
  size?: number
  type?: "primary" | "seconday" | "success" | "error"
  weight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "ultralight" | "thin" | "light" | "medium" | "regular" | "semibold" | "condensedBold" | "condensed" | "heavy" | "black"
}

export default function StyledText({ children, size, weight, type }: Props) {
  return (
    <Text style={{
      fontSize: size ?? 15,
      fontWeight: weight,
      color: type === "primary" ?
        THEME.primary
        :
        type === "seconday" ?
          THEME.secondary
          :
          type === "success" ?
            THEME.success
            :
            type === "error" ?
              THEME.danger
              :
              THEME.surface_content
    }}>
      {children}
    </Text>
  )
}