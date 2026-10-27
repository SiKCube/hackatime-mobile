import { ActivityIndicator } from "react-native";
import { THEME } from "./theme";

interface Props {
  size: "small" | "large" | number
}

export default function LoadingSpinner({ size }: Props) {
  return (
    <ActivityIndicator
      size={size}
      color={THEME.on_primary}
    />
  )
}