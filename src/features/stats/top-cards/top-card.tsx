import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string
  value: string
  important?: boolean
}

export default function TopCard({ title, value, important }: Props) {
  return (
    <StyledCard important={important}>
      <StyledText size={15} type="seconday">{title}</StyledText>
      <StyledText size={20} weight="bold">{value}</StyledText>
    </StyledCard>
  )
} 
