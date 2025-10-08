import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "@/components/BaseComponents/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AD_BULLETS } from "@/utils/data";
import Constants from "expo-constants";
import axios from "axios";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { router } from "expo-router";

const WalletScreen = () => {
  const [userPassMins, setUserPassMins] = useState<number>(0);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const getUserPassMins = async () => {
    try {
      const response = await axios.get("http://192.168.0.10:8000/user_mins");
      if (response.status === 200) {
        const mins = response.data;
        setUserPassMins(mins);
        setRefreshCount(refreshCount + 1);
      } else {
        console.warn("Unable to fetch user Mins");
        setUserPassMins(0);
      }
    } catch (error) {
      if (error instanceof Error) console.error("Error: ", error.message);
    }
  };
  useEffect(() => {
    refreshCount < 1 ? getUserPassMins() : console.log("");
  }, []);
  return (
    <View style={styles.container}>
      {/* Close Wallet */}

      <CustomPressable
        style={{
          width: 40,
          height: 40,
          backgroundColor: "gray",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
        }}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="close" size={22} />
      </CustomPressable>

      {/* Header */}
      <View>
        <AppText input="Wallet" fontSize={28} fontWeight="500" />
      </View>

      {/* LimePass */}
      <View
        style={{ width: "100%", borderWidth: 1, padding: 20, borderRadius: 20 }}
      >
        <AppText input="LimePass" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <AppText
            input={`${userPassMins} min${userPassMins > 1 ? "s" : ""}`}
            fontSize={50}
          />
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
        {/* Inner Ads */}
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
      </View>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
    rowGap: 20,
  },
});
