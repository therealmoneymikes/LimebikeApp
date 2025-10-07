import { StyleSheet } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomerDrawerContent from "./CustomerDrawerContent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./index";

export type DrawerParamList = {
  index: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function MapDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={(props) => {
          return <CustomerDrawerContent {...props} />;
        }}
        screenOptions={{
          drawerPosition: "left",
          drawerType: "slide",
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#fff",
            width: "70%"
          },
          sceneStyle: {
            backgroundColor: "transparent"
          }
        }}
      
      >
        <Drawer.Screen name="index" component={Map} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
