import { Stack } from "expo-router";

const MapScreens = () => {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MapScreens;
