import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AppText from "@/components/BaseComponents/AppText";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colours from "@/config/colours";
import { AD_BULLETS } from "@/utils/data";
import { router } from "expo-router";

interface MenuItemsProps {
  option: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  action?: () => void;
}
const CustomerDrawerContent = (props: DrawerContentComponentProps) => {
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSafety, setShowSafety] = useState<boolean>(false);
  const [showDonation, setShowDonation] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const appVersion = Constants.expoConfig?.extra?.appVersion;

  const handleShowWallet = () => {
    setShowWallet(true);
    router.navigate("(menu)/WalletScreen")
    props.navigation.closeDrawer();
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    props.navigation.closeDrawer();
  };

  const handleShowSafety = () => {
    setShowSafety(true);
    props.navigation.closeDrawer();
  };

  const handleShowDonation = () => {
    setShowDonation(true);
    props.navigation.closeDrawer();
  };

  const handleShowHelp = () => {
    setShowHelp(true);
    props.navigation.closeDrawer();
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    props.navigation.closeDrawer();
  };
  
  const MENU_ITEMS: MenuItemsProps[] = [
    {
      option: "Wallet",
      icon: "wallet-bifold",
      action: handleShowWallet,
    },
    { option: "History", icon: "history", action: handleShowHistory },
    { option: "Safety Center", icon: "shield-check", action: handleShowSafety },
    { option: "Donation", icon: "heart", action: handleShowDonation },
    { option: "Help", icon: "chat-question", action: handleShowHelp },
    { option: "Settings", icon: "cog", action: handleShowSettings },
    {
      option: "Close Menu",
      icon: "close",
      action: () => props.navigation.closeDrawer(),
    },
  ];


  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: "#fff", flex: 1, gap: 10 }}
      style={styles.drawerContainer}
    >
      {/* Inner Drawer */}
      <View style={styles.innerContainer}>
        {/* Title */}
        <AppText input="Hello Lime" fontSize={30} fontWeight={500} />
        {/* Ad */}
        <View
          style={{
            width: "100%",
            borderRadius: 20,
            height: 230,
            backgroundColor: "#D2F7E3",
            padding: 15,
            gap: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              width: "100%",
            }}
          >
            <AppText
              input="Save 40% or more with LimePass"
              fontSize={20}
              fontWeight={500}
            />
          </View>
          <View style={{ gap: 4 }}>
            {AD_BULLETS.map((point, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <MaterialCommunityIcons
                  name="check"
                  color={"green"}
                  style={{ fontWeight: "bold" }}
                  size={17}
                />
                <AppText input={`${point}`} fontSize={16} fontWeight={500} />
              </View>
            ))}
          </View>
          {/* Add mins button */}
          <CustomPressable
            style={{
              backgroundColor: colours.baseGreen,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 15,
              width: "60%",
            }}
            onPress={() => console.log("Go to add mins page")}
          >
            <AppText input="Add minutes" fontWeight={500} />
          </CustomPressable>
        </View>

        {/* Action Buttons */}

        {MENU_ITEMS.map((op, index) => (
          <CustomPressable
            key={index}
            onPress={op.action ?? (() => console.log("No action"))}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 30,
              }}
            >
              <MaterialCommunityIcons
                name={`${op.icon}`}
                size={40}
                color="gray"
              />
              <AppText input={`${op.option}`} />
            </View>
          </CustomPressable>
        ))}
      </View>
      {/* App Version */}
      <View>
        <AppText input={`v${appVersion}`} fontSize={15} color="gray" />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomerDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  drawerContainer: {},
  innerContainer: {
    flex: 1,
    padding: 10,
    rowGap: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
