import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="OtherOptionsScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignInScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EmailEnterCodeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EmailSentScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PhoneSentScreen" options={{ headerShown: false }} />
    
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
