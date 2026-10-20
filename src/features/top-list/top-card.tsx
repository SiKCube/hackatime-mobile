import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string
  value: string
  important?: boolean
}

export default function TopCard({ title, value, important }: Props) {
  return (
    <View>
      <Text style={{ fontSize: 15 }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{value}</Text>
    </View>
  )
} 
