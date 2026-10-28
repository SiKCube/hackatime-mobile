import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { ActivityIndicator, View } from "react-native";

interface Props {
  width?: number,
  height: number,
}

export default function LoadingSkeleton({ width, height }: Props) {
  const { themeData } = useTheme()

  return (
    <View style={{
      width: width ? width : "100%", height,
      backgroundColor: themeData.surface_100,
      borderColor: themeData.darkless,
      borderRadius: 16,
      borderWidth: 1,
      justifyContent: "center",
      alignContent: "center"
    }}>
      <ActivityIndicator
        size={"large"}
        color={themeData.primary}
      />
    </View>
  )
}
