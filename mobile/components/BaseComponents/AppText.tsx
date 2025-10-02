import { StyleSheet, Text, TextProps, StyleProp } from "react-native";
import React from "react";

interface AppTextProps {
  input: string;
  style?: StyleProp<TextProps>;
  fontSize?: number
}
const AppText = ({ input, style, fontSize = 18}: AppTextProps) => {
  return <Text style={[styles.text, {fontSize: fontSize}, style]}>{input}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    color: "white",
    
  },
});
