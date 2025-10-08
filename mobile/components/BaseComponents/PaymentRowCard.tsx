import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "@/components/BaseComponents/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MCIcons, FTIcons } from "@/types/icons/iconTypes";
import CustomPressable from "./CustomPressable";

interface PaymentRowProps {
  title: string;
  icon: MCIcons | FTIcons;
  iconSize?: number;
  paymentHandler: Function;
}
const PaymentRowCard = ({
  title,
  icon,
  iconSize = 24,
  paymentHandler,
}: PaymentRowProps) => {
  return (
    <CustomPressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "100%",
        height: 50,
      }}
      onPress={() => paymentHandler}
    >
      <View style={{ flexDirection: "row", columnGap: 12 }}>
        <MaterialCommunityIcons name={icon as MCIcons} size={iconSize} />
        <AppText input={title} fontWeight={400} />
      </View>
    </CustomPressable>
  );
};

export default PaymentRowCard;
