import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import AppText from "@/components/BaseComponents/AppText";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
const CELL_COUNT = 6;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const PhoneSentScreen = () => {
  const data = useLocalSearchParams();
  console.log("OTOP", data.otp);
  console.log("PHONE", data.phone);

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [otpValue, setOtpValue] = useState<string>(data.otp as string);
  const notifyOTPTemp = async () => {
    try {
      const response = await axios.post("http://192.168.0.10:8000/otp", {
        phone_number: data.phone,
      });
      if (response.status === 200) {
        const data: { otp: string } = response.data;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Your OTP Code",
            body: `Your OTP is: ${data.otp}`,
          },
          trigger: null, //Null = immediate
        });
        setOtpValue(data.otp);
        return data.otp;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.baseContainer}>
      <View
        style={{
          borderRadius: 50,
          backgroundColor: "gray",
          padding: 10,
          width: 40,
        }}
      >
        <CustomPressable
          onPress={() => {
            router.navigate("/(auth)/OtherOptionsScreen");
            console.log("Navigate from Other Options Screen to SignInUpScreen");
          }}
          // onLongPress={async () => {
          //   const str = await Clipboard.getStringAsync()
          //   setValue(str)
          // }}
        >
          <MaterialCommunityIcons name="arrow-left" color="black" size={20} />
        </CustomPressable>
      </View>

      {/* Enter Code */}
      <View style={{ gap: 5 }}>
        <AppText
          input="Enter the code that we sent to"
          fontSize={26}
          fontWeight="500"
        />
        <AppText
          input={`${data.phone}`}
          fontSize={26}
          color="gray"
          fontWeight="400"
        />
      </View>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      {/* Didn't Receive Hyperlink */}
      <View style={{ flexDirection: "row", gap: 4 }}>
        <AppText input="Didn't receive it?" fontSize={16} />
        {/* #58ED8D */}
        <CustomPressable onPress={() => notifyOTPTemp()}>
          <AppText input="Resend code" fontSize={16} color="green" />
        </CustomPressable>
      </View>

      <View style={{ marginBottom: 15 }}>
        <CustomPressable
          onPress={() => {
            if (value.length === 6 && value === data.otp) {
              router.navigate("(map)/map");
            } else {
              console.log(value);
              console.log(otpValue);
            }
          }}
          style={{
            flexDirection: "row",
            height: 57,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: value.length === 6 ? "#58ED8D" : "gray",
          }}
        >
          <AppText input="Next" fontWeight="700" />
        </CustomPressable>
      </View>
    </View>
  );
};

export default PhoneSentScreen;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
    rowGap: 20,
  },
  root: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  codeFieldRoot: { marginTop: 20, justifyContent: "space-between" },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    borderRadius: 8,
  },
  focusCell: {
    borderColor: "#000",
  },
});
