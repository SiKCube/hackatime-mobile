import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { THEME } from "./theme";

interface Props {
  msg: string | null
  type: "error" | "success" | "wow"
}

export default function Alert({ msg, type }: Props) {
  return (
    <>
      {
        msg &&
        <View style={{
          flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
          gap: 5,
          padding: 10,
          borderWidth: 1,
          borderColor: type === "error" ? `${THEME.danger}` : type === "success" ? THEME.success : THEME.primary,
          backgroundColor: type === "error" ? `${THEME.danger}1a` : type === 'success' ? `${THEME.success}1a` : `${THEME.primary}1a`,
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
                  THEME.danger
                  :
                  THEME.success}
                size={17} />
            }
              {
                type !== "wow" && <Text style={{
                  color: type === "error" ? THEME.danger : THEME.success,
                  fontWeight: "bold",
                }}>
                  {type}
                </Text>
            }
          </View>
          <Text style={{
            color: type === "error" ? THEME.danger : type === "success" ? THEME.success : THEME.primary,
          }}>
            {msg}
          </Text>
        </View>
      }
    </>
  )
}