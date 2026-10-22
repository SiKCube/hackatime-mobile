import { View } from "react-native";
import { THEME } from "./theme";

interface Props {
  width?: number,
  height: number,
}

export default function LoadingSkeleton({ width, height }: Props) {
  return (
    <View style={{
      width: width ? width : "100%", height,
      backgroundColor: THEME.surface_100,
      borderColor: THEME.darkless,
      borderRadius: 16,
      borderWidth: 1,
    }} />
  )
}
