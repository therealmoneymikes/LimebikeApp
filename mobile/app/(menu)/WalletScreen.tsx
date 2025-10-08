import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "@/components/BaseComponents/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AD_BULLETS, PAYMENT_METHODS, REFERALS_AND_PROMOS } from "@/utils/data";
import Constants from "expo-constants";
import axios from "axios";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { router } from "expo-router";
import colours from "@/config/colours";
import { PaymentMethodsType } from "@/types/payments/paymentMethods";
import { FTIcons, MCIcons } from "@/types/icons/iconTypes";
import PaymentRowCard from "@/components/BaseComponents/PaymentRowCard";
import BaseOptionRow from "@/components/BaseComponents/BaseOptionRow";
import themes from "@/config/themes";

//
const WalletScreen = () => {
  const [userPassMins, setUserPassMins] = useState<number>(0);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [userLimeCash, setUserLimeCash] = useState<number>(0.0);

  console.dir(PAYMENT_METHODS, { depth: 4 });
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
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
          ...themes.baseShadowConfig,
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
      <ScrollView
        style={{
          width: "100%",
          padding: 5,
        }}
      >
        <View style={{ rowGap: 25 }}>
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: 20,
              borderRadius: 20,
              rowGap: 3,
            }}
          >
            <AppText input="LimePass" fontWeight={500} color="gray" />
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
                fontSize={40}
                fontWeight={600}
              />
              <MaterialCommunityIcons name="chevron-right" size={30} />
            </View>
            {/* Inner Ads */}
            <View
              style={{
                gap: 4,
                backgroundColor: "#D4FFDA",
                padding: 15,
                borderRadius: 20,
                rowGap: 15,
              }}
            >
              <AppText
                input="Save 40% or more with LimePass"
                fontWeight={500}
                fontSize={19}
              />
              <View style={{ marginBottom: 10, rowGap: 4 }}>
                {AD_BULLETS.map((point, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      color={"green"}
                      style={{ fontWeight: "bold" }}
                      size={17}
                    />
                    <AppText
                      input={`${point}`}
                      fontSize={14}
                      fontWeight={400}
                      color="black"
                    />
                  </View>
                ))}
              </View>
              <CustomPressable
                style={{
                  borderRadius: 30,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  backgroundColor: colours.baseGreen,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40%",
                }}
                onPress={() => console.log("Add minutes")}
              >
                <AppText input="Add minutes" fontSize={14} fontWeight={500} />
              </CustomPressable>
            </View>
            {/* End of Inner Ads */}
          </View>
          {/* End of LimePass Card */}

          {/* Promos Card */}
          <View style={{ justifyContent: "flex-start", rowGap: 25 }}>
            <AppText
              input="Promos & referrals"
              fontSize={20}
              fontWeight={600}
            />
            <View style={{ rowGap: 15 }}>
              {REFERALS_AND_PROMOS.map((op, index) => (
                <BaseOptionRow
                  key={index}
                  title={op.title}
                  icon={op.icon as MCIcons}
                  onPress={op.action}
                />
              ))}
            </View>
          </View>

          {/* Payment */}
          <View style={{ justifyContent: "flex-start", rowGap: 25 }}>
            <AppText input="Payment" fontSize={20} fontWeight={600} />
            {/* Promos Card */}
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "auto",
                borderRadius: 18,
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
              }}
            >
              {PAYMENT_METHODS.map((method, index) => (
                <PaymentRowCard
                  key={index}
                  icon={method.icon}
                  title={method.title}
                  paymentHandler={method.action}
                />
              ))}
            </View>

            {/* Gift Card*/}
            <CustomPressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // borderWidth: StyleSheet.hairlineWidth,
                height: 60,
                borderRadius: 18,
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
              }}
              onPress={() => console.log("Showing Lime Cash...")}
            >
              <View style={{ flexDirection: "row", columnGap: 12 }}>
                <AppText input="Lime Cash" fontWeight={400} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AppText
                  input={userLimeCash.toPrecision(3).toString()}
                  fontWeight={400}
                />
                <MaterialCommunityIcons name="chevron-right" size={30} />
              </View>
            </CustomPressable>
          </View>
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 13,
            padding: 15,
            marginTop: 25,
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: 2,
          }}
        >
          <AppText
            input="A small amount may be temporarily placed on hold when you start your ride."
            fontSize={14}
          />
          <CustomPressable
            onPress={() => Linking.canOpenURL("https://google.com")}
          >
            <AppText
              input="Learn more"
              color={colours.baseGreen}
              fontSize={14}
              style={{ flexWrap: "nowrap" }}
            />
          </CustomPressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
    paddingTop: Constants.statusBarHeight + 20,
    rowGap: 20,
  },
});
