import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "@react-native-community/checkbox";
import AppText from "@/components/BaseComponents/AppText";
const SignInScreen = () => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  return (
    <SafeAreaView>
      {/* Bottom Half */}
      <View style={styles.offersContainer}>
        <View style={styles.checkBoxOptionContainer}>
          <Pressable style={styles.checkbox}></Pressable>
          <AppText
            fontSize={14}
            input="Send me offers and news from Lime via email and other electronic messages"
          />
        </View>
        <View style={styles.checkBoxOptionContainer}>
          <Pressable style={styles.checkbox}></Pressable>
          <AppText
            fontSize={14}
            input="I agree to Lime's User Agreement and Privacy Policy"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  checkbox: { borderColor: "grey", borderWidth: 3, width: 40, height: 40 },
  offersContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: "80%",
    borderColor: "transparent",
    borderWidth: 3,
    padding: 10
  },
  checkBoxOptionContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
