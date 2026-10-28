import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { Href, Link } from "expo-router"

interface Props {
  children: React.ReactNode
  size?: number
  type?: "primary" | "seconday" | "success" | "error"
  weight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "ultralight" | "thin" | "light" | "medium" | "regular" | "semibold" | "condensedBold" | "condensed" | "heavy" | "black"
  href: Href
}

export default function StyledTextLink({ children, size, weight, type, href }: Props) {
  const { themeData } = useTheme()

  return (
    <Link
      href={href}
      style={{
        fontSize: size ?? 15,
        fontWeight: weight,
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
    </Link>
  )
}