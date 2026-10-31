import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { Href, Link } from "expo-router"
import { Text, View } from "react-native"

interface Props {
  children?: React.ReactNode
  text?: string
  href: Href
  type: "primary" | "secondary"
  disable?: boolean
  fullWidth?: boolean
}

export default function StyledLinkButton({ children, href, text, type, disable, fullWidth }: Props) {
  const { themeData } = useTheme()

  return (
    <Link
      href={href}
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
        width: fullWidth ? "100%" : "auto",
        backgroundColor: type === "primary" ? themeData.primary : themeData.secondary
      }}>
        {children}
        {
          text && <Text style={{
            fontWeight: "bold",
            color: type === "primary" ? themeData.on_primary : themeData.dark
          }}>{text}</Text>
        }
      </View>
    </Link>
  )
}