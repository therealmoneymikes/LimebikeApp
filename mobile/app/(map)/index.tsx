import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Alert, Linking } from "react-native";
import MapView, {
  Marker,
  Region,
  PROVIDER_GOOGLE,
  MapStyleElement,
} from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import mapConfigs from "@/config/mapConfigs";
import AppText from "@/components/BaseComponents/AppText";

const { width, height } = Dimensions.get("window");

//https://snazzymaps.com
export default function Map() {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const [hasLocationPermssion, setHasLocationPermission] =
    useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleElement[]>([]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access location was denied",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    setHasLocationPermission(true);
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
    });
    const { latitude, longitude } = location.coords;

    setUserLocation({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={
          userLocation ?? {
            latitude: 51.5074,
            longitude: -0.1278,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsBuildings={true}
        showsCompass={true}
        customMapStyle={mapStyle}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
            description="This is London"
          />
        )}
      </MapView>
      {/* Top Button Panel */}
      <View style={styles.buttonPanel}>
        <View style={styles.actionBtnContainer}>
          <CustomPressable style={styles.actionBtn} onPress={openDrawer}>
            <MaterialCommunityIcons name="account" size={22} />
          </CustomPressable>

          <CustomPressable
            style={styles.actionBtn}
            onPress={() => console.log("Give a gift screen")}
          >
            <MaterialCommunityIcons name="gift" size={22} />
          </CustomPressable>
        </View>
      </View>

      {/* Theme Panel */}
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: "20%",
          zIndex: 10,
          alignItems: "center",
          justifyContent: "center",
          rowGap: 20,
          backgroundColor: "#B8F493",
          height: 200,
          width: 60,
          borderRadius: 20,
        }}
      >
        {/* Navy Blue */}

        <View style={{ gap: 2 }}>
          <CustomPressable
            style={[styles.actionBtn, { backgroundColor: "navy" }]}
            onPress={() => setMapStyle(mapConfigs.deepBlue)}
          >
            <MaterialCommunityIcons name="brush" size={24} color="#fff" />
          </CustomPressable>
          {/* <AppText input="Navy" fontWeight={300} color="white" /> */}
        </View>

        {/* Gray Scale*/}
        <View style={{ gap: 2 }}>
          <CustomPressable
            style={[styles.actionBtn, { backgroundColor: "gray" }]}
            onPress={() => setMapStyle(mapConfigs.subtleGrayscale)}
          >
            <MaterialCommunityIcons name="brush" size={24} color="#fff" />
          </CustomPressable>
          {/* <AppText input="Grayscale" fontWeight={300} color="white" /> */}
        </View>

        {/* Ultralight*/}
        <View style={{ gap: 2 }}>
          <CustomPressable
            style={[styles.actionBtn, { backgroundColor: "#883b20" }]}
            onPress={() => setMapStyle(mapConfigs.marsAnalog)}
          >
            <MaterialCommunityIcons name="brush" size={24} color="#fff" />
          </CustomPressable>
          {/* <AppText input="Grayscale" fontWeight={300} color="white" /> */}
        </View>
      </View>
      {/* Bottom Tabs */}
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  buttonPanel: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  actionBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 50,
    padding: Constants.statusBarHeight,
    width: "100%",
    paddingHorizontal: 20,
  },
  actionBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "gray",
  },
});
