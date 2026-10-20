import { DimensionValue, StyleSheet, View } from "react-native"
import { THEME } from "../theme"

interface Props {
  children: React.ReactNode
  important?: boolean
  width?: DimensionValue
}

export default function StyledCard({ children, important, width }: Props) {
  return (
    <View style={{
      ...CardStyle.card,
      backgroundColor: important ? `${THEME.primary}1a` : `${THEME.surface_100}4d`,
      borderColor: important ? THEME.primary : THEME.surface_200,
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
