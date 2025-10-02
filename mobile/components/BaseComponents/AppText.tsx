import { StyleSheet, Text, TextProps, StyleProp, TextStyle } from "react-native";
import React from "react";

interface AppTextProps {
  input: string;
  style?: StyleProp<TextProps>;
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"],
  numberOfLines?: number,
  width?: TextStyle["width"]
}
const AppText = ({
  input,
  style,
  color = "black",
  fontSize = 18,
  fontWeight = 400,
  numberOfLines = 2,
  width,
}: AppTextProps) => {
  return (
    <Text numberOfLines={numberOfLines}
      style={[
        styles.text,
        { fontSize: fontSize, color: color, fontWeight: fontWeight, width: width},
        style,
      ]}
    >
      {input}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    // color: "white",
    
  },
});
