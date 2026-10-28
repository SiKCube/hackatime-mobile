import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  msg: string | null
  type: "error" | "success" | "wow"
}

export default function Alert({ msg, type }: Props) {
  const { themeData } = useTheme()

  return (
    <>
      {
        msg &&
        <View style={{
          flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
          gap: 5,
          padding: 10,
          borderWidth: 1,
          borderColor: type === "error" ? `${themeData.danger}` : type === "success" ? themeData.success : themeData.primary,
          backgroundColor: type === "error" ? `${themeData.danger}1a` : type === 'success' ? `${themeData.success}1a` : `${themeData.primary}1a`,
          borderRadius: 8,
        }}>
          <View style={{ flexDirection: "row", gap: 3, justifyContent: "flex-start", alignItems: "center" }}>
            {
              type !== "wow" && <Ionicons
                name={type === "error" ?
                  "warning"
                  :
                  "checkbox"
                }
                color={type === "error" ?
                  themeData.danger
                  :
                  themeData.success}
                size={17} />
            }
            {
              type !== "wow" && <Text style={{
                color: type === "error" ? themeData.danger : themeData.success,
                fontWeight: "bold",
              }}>
                {type}
              </Text>
            }
          </View>
          <Text style={{
            color: type === "error" ? themeData.danger : type === "success" ? themeData.success : themeData.primary,
          }}>
            {msg}
          </Text>
        </View>
      }
    </>
  )
}