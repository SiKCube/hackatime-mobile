import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Pressable, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Theme, ThemeName } from "./context/theme";
import { useTheme } from "./context/theme-ctx-provider";

export default function ThemeCard({
  dark, darker, darkless,
  danger, info, warning, success,
  surface, surface_100, surface_200, surface_300, surface_content,
  input, muted, on_primary, primary, secondary, text_muted, name, namekey
}: Theme) {
  const { setTheme, theme } = useTheme()

  return (
    <Pressable onPress={() => setTheme(namekey as ThemeName)}>
      <StyledCard important={theme === namekey}>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <StyledText weight="bold" size={20}>{name}</StyledText>
            {
              theme === namekey && <StyledText weight="bold" type="primary">Selected</StyledText>
            }
          </View>
          <View style={{ padding: 10, backgroundColor: darker, borderRadius: 10, gap: 7 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 7, backgroundColor: surface, borderRadius: 10 }}>
              <Text style={{ fontWeight: "bold", color: surface_content, fontSize: 12 }}>Dashboard</Text>
              <Text style={{ fontWeight: "bold", color: secondary, fontSize: 12 }}>2h 14m</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Svg height={10} width={"80%"}>
                <Rect
                  fill={primary}
                  width={"100%"}
                  height={10}
                  x={0}
                  y={0}
                  rx={5}
                  ry={5}
                />
              </Svg>
              <Svg height={10} width={"15%"}>
                <Rect
                  fill={surface_100}
                  width={"100%"}
                  height={10}
                  x={0}
                  y={0}
                  rx={5}
                  ry={5}
                />
              </Svg>
            </View>
            <Svg width={"100%"} height={7}>
              <Rect
                fill={info}
                width={"10%"}
                height={7}
                x={0}
                y={0}
                rx={3}
                ry={5}
              />
              <Rect
                fill={danger}
                width={"10%"}
                height={7}
                x={50}
                y={0}
                rx={3}
                ry={5}
              />
              <Rect
                fill={warning}
                width={"10%"}
                height={7}
                x={100}
                y={0}
                rx={3}
                ry={5}
              />
            </Svg>
          </View>
        </View>
      </StyledCard>
    </Pressable>
  )
}