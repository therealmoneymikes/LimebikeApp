import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppText from "@/components/BaseComponents/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { text } from "stream/consumers";
import colours from "@/config/colours";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";
const EmailEnterCodeScreen = () => {
  const data = useLocalSearchParams();

  const [emailOTP, setEmailOTP] = useState<string>("");

  const handleEmailInput = (text: string) => {
    setEmailOTP(text);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Base Navigation Arrow */}
      <View
        style={{
          backgroundColor: "gray",
          borderRadius: 50,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomPressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} />
        </CustomPressable>
        {/* Text */}
      </View>

      {/* Heading Text */}
      <View style={{ marginTop: 20 }}>
        <AppText input={`Enter the code sent to `} />
        <AppText input={`${data.email}`} fontWeight={"700"} color={"green"} />
      </View>

      {/* Email OTP Text Box */}

      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 1,
          paddingVertical: 10,
          marginVertical: 30,
        }}
      >
        <TextInput
          value={emailOTP}
          onChangeText={(text) => handleEmailInput(text)}
          placeholder="Enter 6-digit code"
          placeholderTextColor="gray"
        />
      </View>

      {/* Action Buttons - Verify and Paste Clipboard */}
      <View style={{ marginBottom: 30, flex: 1, justifyContent: "flex-end" }}>
        <View style={{ marginBottom: 15, alignItems: "center", gap: 10 }}>
          <CustomPressable
            onPress={() => {
              if (emailOTP.length === 6 && emailOTP === data.otp) {
                router.navigate("(map)/Map");
              } else {
                console.log(emailOTP);
              }
            }}
            style={{
              flexDirection: "row",
              height: 57,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: emailOTP.length === 6 ? "#58ED8D" : "gray",
            }}
          >
            <AppText input="Verify" fontWeight="700" />
          </CustomPressable>
          {/* Paste from Clipboard */}
          <CustomPressable
            onPress={async () => {
              const str = await Clipboard.getStringAsync();
              setEmailOTP(str);
            }}
          >
            <AppText
              input="Paste from Clipboard"
              color={"green"}
              fontWeight={600}
              fontSize={15}
            />
          </CustomPressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EmailEnterCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
  },
  btn: {
    flexDirection: "row",
    height: 57,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58ED8D",
  },
});
