import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { ActivityIndicator } from "react-native";

interface Props {
  size: "small" | "large" | number
}

export default function LoadingSpinner({ size }: Props) {
  const { themeData } = useTheme()

  return (
    <ActivityIndicator
      size={size}
      color={themeData.on_primary}
    />
  )
}