import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Dispatch, SetStateAction } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";

interface Props {
  placeholder: string
  change: string
  setChange: Dispatch<SetStateAction<string>>
  keyboardType: KeyboardTypeOptions
  width: number
}

export default function StyledInput({ keyboardType, placeholder, change, setChange, width }: Props) {
  const { themeData } = useTheme()
  
  return (
    <View style={{ width: "100%" }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: themeData.surface_300,
          backgroundColor: themeData.input,
          borderRadius: 6,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          color: themeData.surface_content,
          width: width,
        }}
        placeholder={placeholder}
        value={change}
        onChangeText={setChange}
        keyboardType={keyboardType}
      />
    </View>
  )
}
