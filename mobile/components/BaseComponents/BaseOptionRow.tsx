import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "./AppText";
import { MCIcons } from "@/types/icons/iconTypes";
import CustomPressable from "./CustomPressable";

interface BaseOptionRowProps {
  title: string;
  icon: MCIcons;
  onPress: () => void | Function
  rowColumnGap?: number;
  rowHeight?: number;
  rowWidth?: ViewStyle["width"]
  rowBorderRadius?: number;
  rowPadding?: number
  rowBackgroundColor?: ViewStyle["backgroundColor"]
  iconSize?: number;
  titleFontWeight?: TextStyle["fontWeight"];
  chevronSize?: number;
}
const BaseOptionRow = ({
  title,
  icon,
  onPress,
  rowHeight = 60,
  rowWidth = "100%",
  rowColumnGap = 12,
  rowBorderRadius = 18,
  rowBackgroundColor = "#fff",
  rowPadding = 10, 
  iconSize = 24,
  titleFontWeight = 400,
  chevronSize = 30,
}: BaseOptionRowProps) => {
  return (
    <CustomPressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: rowWidth,
        height: rowHeight,
        borderRadius: rowBorderRadius,
        padding: rowPadding,
        paddingHorizontal: 20,
        backgroundColor: rowBackgroundColor,
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", columnGap: rowColumnGap }}>
        <MaterialCommunityIcons name={icon} size={iconSize} />
        <AppText input={title} fontWeight={titleFontWeight} />
      </View>
      <MaterialCommunityIcons name="chevron-right" size={chevronSize} />
    </CustomPressable>
  );
};

export default BaseOptionRow;

const styles = StyleSheet.create({});
