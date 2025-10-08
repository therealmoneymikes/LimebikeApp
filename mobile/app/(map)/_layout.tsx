import { Drawer } from "expo-router/drawer";
import CustomerDrawerContent from "./CustomerDrawerContent";

export default function MapDrawerLayout() {
  return (
    <Drawer
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
      drawerContent={(props) => <CustomerDrawerContent {...props} />}
    >
      <Drawer.Screen name="index" options={{ title: "Map" }} />

    </Drawer>
  );
}
