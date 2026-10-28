import { Dispatch } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";

interface Props {
  placeholder: string
  change: string
  setChange: Dispatch<string>
  keyboardType: KeyboardTypeOptions
}

export default function StyledInput({ keyboardType, placeholder, change, setChange }: Props) {
  return (
    <View>
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
        }}
        placeholder={placeholder}
        value={change}
        onChangeText={setChange}
        keyboardType={keyboardType}
      />
    </View>
  )
}
