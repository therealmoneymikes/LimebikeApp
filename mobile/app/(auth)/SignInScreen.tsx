import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "@react-native-community/checkbox";
import AppText from "@/components/BaseComponents/AppText";
import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SFSymbol, SymbolView } from "expo-symbols";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { router } from "expo-router";

interface SignInButtonProps {
  logo: keyof SFSymbol | string;
  content: string;
  fallback: keyof typeof MaterialCommunityIcons.glyphMap;
  btnAction: () => void;
  color?: string;
}
const SignInScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [offerOption, setOfferOption] = useState<boolean>(false);
  const [policyOption, setPolicyOption] = useState<boolean>(false);

  const otherOptionsAction = (data?: object) => {
    router.push("/(auth)/OtherOptionsScreen");
  };

  const toggleCheckbox = (currentIndex: number): void => {
    setSelectedIndex((prev) => (prev === currentIndex ? null : currentIndex));
  };

  const handlePolicyBox = (currentIndex: number): void => {
    setPolicyOption(!(currentIndex === selectedIndex));
  };

  const handleOfferBox = (currentIndex: number): void => {
    setOfferOption(!(currentIndex === selectedIndex));
  };
  const checkBoxMenu = [
    {
      content:
        "Send me offers and news from Lime via email and other electronic messages",
      action: handleOfferBox,
    },
    {
      content: "I agree to Lime's User Agreement and Privacy Policy",
      action: handlePolicyBox,
    },
  ];
  const signInOptions: SignInButtonProps[] = [
    {
      logo: "applelogo",
      content: "Sign in with Apple",
      fallback: "apple",
      btnAction: () => router.push("/(auth)/OtherOptionsScreen"),
      color: "black",
    },
    {
      logo: "",
      content: "Sign In with Google",
      fallback: "google",
      btnAction: () => router.push("/(auth)/OtherOptionsScreen"),
      color: "white",
    },
    {
      logo: "",
      content: "Other options",
      fallback: "set-none",
      btnAction: () => router.push("/(auth)/OtherOptionsScreen"),
      color: "",
    },
  ];

  return (
    <View>
      {/* Checkboxes */}
      <View style={{ height: "55%" }}>
        <Image
          source={require("../../assets/images/signin/limebikehomepic.jpg")}
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        />
      </View>

      {/* Bottom Half */}
      <View
        style={{
          height: "45%",
          alignContent: "center",
          rowGap: 4,
          justifyContent: "flex-start",
          backgroundColor: "#F9F6EE",
        }}
      >
        <View style={styles.offersContainer}>
          {checkBoxMenu.map((obj, index) => (
            <View style={styles.checkBoxOptionContainer} key={index}>
              <Pressable
                onPress={() => {
                  toggleCheckbox(index);
                  obj.action(index);
                }}
                style={[
                  styles.checkbox,
                  {
                    backgroundColor:
                      selectedIndex === index ? "green" : "white",
                    borderColor: selectedIndex === index ? "green" : "gray",
                  },
                ]}
              >
                {selectedIndex === index && (
                  <MaterialCommunityIcons
                    name="check"
                    color="white"
                    size={25}
                    style={{ alignSelf: "center" }}
                  />
                )}
              </Pressable>
              <AppText fontSize={12} input={obj.content} width="90%" />
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View
          style={[styles.btnContainer, { opacity: !policyOption ? 0.4 : 1 }]}
        >
          {signInOptions.map((obj, index) => (
            <CustomPressable
              onPress={!policyOption ? () => console.log("") : obj.btnAction}
              key={index}
              style={{
                backgroundColor: obj.color,
                borderWidth: signInOptions.length - 1 === index ? 0 : 1,
                ...styles.signInBtn,
              }}
            >
              <View>
                {obj.logo && (
                  <SymbolView
                    shouldRasterizeIOS
                    name={obj.logo as SFSymbol}
                    size={22}
                    style={{ alignSelf: "center" }}
                    type="multicolor"
                    tintColor="gray"
                    fallback={
                      <MaterialCommunityIcons
                        size={18}
                        name={obj.fallback}
                        color={index === 0 ? "white" : "black"}
                      />
                    }
                  />
                )}
              </View>
              <AppText
                input={obj.content}
                fontWeight={600}
                color={index === 0 ? "white" : "black"}
              />
            </CustomPressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderRadius: 3,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  offersContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    padding: 20,
  },
  checkBoxOptionContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    width: "100%",
    marginHorizontal: 20,
  },
  signInBtn: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 20,
    padding: 20,
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    gap: 5,
  },
  btnContainer: {
    padding: 10,
    rowGap: 7,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
