import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { Text } from "react-native"

interface Props {
  children: React.ReactNode
  size?: number
  type?: "primary" | "seconday" | "success" | "error"
  weight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "ultralight" | "thin" | "light" | "medium" | "regular" | "semibold" | "condensedBold" | "condensed" | "heavy" | "black"
  textAling?: "left" | "right" | "center" | "justify" | "auto"
}

export default function StyledText({ children, size, weight, type, textAling }: Props) {
  const { themeData } = useTheme()

  return (
    <Text style={{
      fontSize: size ?? 15,
      fontWeight: weight,
      textAlign: textAling ? textAling : "auto",
      color: type === "primary" ?
        themeData.primary
        :
        type === "seconday" ?
          themeData.secondary
          :
          type === "success" ?
            themeData.success
            :
            type === "error" ?
              themeData.danger
              :
              themeData.surface_content
    }}>
      {children}
    </Text>
  )
}