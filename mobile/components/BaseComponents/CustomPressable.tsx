import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, { ReactNode } from "react";

interface CustomPressableProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CustomPressable = ({
  onPress,
  children,
  style,
  ...props
}: CustomPressableProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }, style]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export default CustomPressable;

const styles = StyleSheet.create({});
