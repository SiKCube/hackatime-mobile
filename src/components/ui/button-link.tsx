import { Dispatch } from "react"
import { Text, View } from "react-native"
import { THEME } from "../theme"
import { Link, Href } from "expo-router"

interface Props {
  children?: React.ReactNode
  text?: string
  href: Href
  type: "primary" | "secondary"
  disable?: boolean
}

export default function StyledLinkButton({ children, href, text, type, disable }: Props) {
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
    </Link>
  )
}