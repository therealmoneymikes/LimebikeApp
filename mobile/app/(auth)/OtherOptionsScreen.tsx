import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppText from "@/components/BaseComponents/AppText";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { router } from "expo-router";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
const OtherOptionsScreen = () => {
  const [byPhoneNumber, setByPhoneNumber] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState<string>("44");
  const [countryFlag, setCountryFlag] = useState<string>("🇬🇧");
  const [country, setCountry] = useState<Country | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    setCountryFlag(country.flag);
    setShowPicker(false);
    setCallingCode(country.callingCode[0]);
  };

  useEffect(() => {
    setCountryFlag("🇬🇧");
    setCallingCode("44");
  }, []);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding": "height"}>
    <View style={styles.baseContainer}>
      {/* Back button */}
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
            router.navigate("/(auth)/SignInScreen");
            console.log("Navigate from Other Options Screen to SignInUpScreen");
          }}
        >
          <MaterialCommunityIcons name="arrow-left" color="black" size={20} />
        </CustomPressable>
      </View>

      {/* Sign in or sign up button */}
      <View>
        <AppText input="Sign in or sign up" color="black" fontSize={30} />
      </View>

      {/* Phone number and email toggle */}
      <View style={{ flexDirection: "row", columnGap: 25 }}>
        <CustomPressable onPress={() => setByPhoneNumber(!byPhoneNumber)}>
          <AppText
            input="Phone number"
            fontWeight={byPhoneNumber ? "700" : "500"}
            color={byPhoneNumber ? "green" : "black"}
          />
        </CustomPressable>
        <CustomPressable onPress={() => setByPhoneNumber(!byPhoneNumber)}>
          <AppText
            input="Email"
            fontWeight={byPhoneNumber ? "500" : "700"}
            color={byPhoneNumber ? "black" : "green"}
          />
        </CustomPressable>
      </View>

      {/* Input Window phone number or email */}
      {/* Country Flag Button opens a screen with all countries and area codes (Recreate) */}
      <View style={{flex: 1, justifyContent: "flex-start"}}>
        {byPhoneNumber ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 15,
                marginHorizontal: 10,
              }}
            >
              <CustomPressable
                onPress={() => setShowPicker(true)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <CountryPicker
                  withFilter
                  withFlag={true}
                  withAlphaFilter
                  withCallingCode={false}
                  countryCode={countryCode}
                  onSelect={onSelect}
                  visible={showPicker}
                  onClose={() => {
                    setShowPicker(false);
                  }}
                  withCountryNameButton={false}
                  withFlagButton={true}
                />
                <MaterialCommunityIcons
                  name={showPicker ? "chevron-up" : "chevron-down"}
                  size={20}
                />
              </CustomPressable>
              <AppText input={`+${callingCode}`} color="black" fontSize={15} />
              <TextInput
                onChangeText={(text) => console.log(text)}
                placeholder="Enter phone number"
                keyboardType={"phone-pad"}
                placeholderTextColor="gray"
                style={{
                  height: 40,
                  flex: 1,
                }}
              />
            </View>
          
        ) : 
        
        (
        /* By Email Option */
            <View
              style={{
                flexDirection: "row",
                height: 40,
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 6,
                borderBottomWidth: 1,
                borderBottomColor: isFocused ? "#58ED8D" : "gray",
              }}
            >
              <TextInput
                placeholder="Enter email"
                placeholderTextColor="gray"
                onChangeText={(text) => console.log(text)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="email-address"
              />
              <MaterialCommunityIcons name="close" color="gray" size={22} />
            </View>
        )}
        </View>

        {/* Next Button */}
        <View style={{marginBottom: 20}}>
          <CustomPressable
            onPress={() => console.log("Next pressed")}
            style={{
              flexDirection: "row",
              height: 57,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#58ED8D",
            }}
          >
            <AppText input="Next" fontWeight="700" />
          </CustomPressable>
        </View>
      </View>
      
    </KeyboardAvoidingView>
  );
};

export default OtherOptionsScreen;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
    rowGap: 20,
  },
});
