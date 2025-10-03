import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import AppText from "@/components/BaseComponents/AppText";
import colours from "@/config/colours";
const EmailSentScreen = () => {
  const data = useLocalSearchParams();

  const openEmailApp = async () => {
    try {
      const url = "mailto:";
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("No email app found on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email app");
      router.navigate("/(auth)/OtherOptionsScreen");
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
        >
          <MaterialCommunityIcons name="arrow-left" color="black" size={20} />
        </CustomPressable>
      </View>
      <View style={{ gap: 5 }}>
        <AppText input="Check your email" fontSize={26} fontWeight="500" />
        <AppText
          input={`${data.email}`}
          fontSize={26}
          color="gray"
          fontWeight="400"
        />
      </View>

      <View style={{ gap: 50, flex: 1 }}>
        {/* Step 1 Instruction */}
        <View
          style={{ gap: 5, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: colours.baseGreen,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText input="1" />
          </View>
          <AppText
            input={`An email was sent to ${data.email} with a link to sign in.`}
            fontSize={14}
            style={{ textAlign: "center" }}
          />
        </View>
        {/* Step 1 Instruction  End */}

        {/* Step 2 Instruction */}
        <View
          style={{ gap: 5, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: colours.baseGreen,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText input="2" />
          </View>
          <AppText
            input={`Open the email and tap the link on this phone to sign in`}
            fontSize={14}
            style={{ textAlign: "center" }}
          />
        </View>
        {/* Step 2 Instruction End */}

        {/* Having trouble */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <AppText input="Having trouble with your link?" fontSize={16} />
          <CustomPressable
            onPress={() => console.log("Go to Enter Email Code Screen")}
          >
            <AppText
              input="Enter code"
              color={"green"}
              fontWeight="600"
              fontSize={16}
            />
          </CustomPressable>
        </View>
        {/* Having trouble end */}
      </View>
      {/* Action Buttons - Open or Resend */}
      <View style={{ marginBottom: 30 }}>
        <View style={{ marginBottom: 15 }}>
          <CustomPressable
            onPress={() => openEmailApp()}
            style={{
              flexDirection: "row",
              height: 57,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#58ED8D",
            }}
          >
            <AppText input="Open Email App" fontWeight="700" />
          </CustomPressable>
        </View>
        <View>
          <CustomPressable
            style={{ alignItems: "center" }}
            onPress={() => console.log("Resend Email")}
          >
            <AppText
              input="Resend email"
              color="green"
              fontSize={15}
              fontWeight="600"
            />
          </CustomPressable>
        </View>
      </View>
    </View>
  );
};

export default EmailSentScreen;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
    rowGap: 20,
  },
});
