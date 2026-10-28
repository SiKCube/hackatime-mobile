import { useTheme } from "@/features/theme/context/theme-ctx-provider"
import { DimensionValue, StyleSheet, View } from "react-native"

interface Props {
  children: React.ReactNode
  important?: boolean
  width?: DimensionValue
}

export default function StyledCard({ children, important, width }: Props) {
  const { themeData } = useTheme()

  return (
    <View style={{
      ...CardStyle.card,
      backgroundColor: important ? `${themeData.primary}1a` : `${themeData.surface}`,
      borderColor: important ? themeData.primary : themeData.surface_200,
      width: width
    }}>
      {children}
    </View>
  )
}

const CardStyle = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  }
})
