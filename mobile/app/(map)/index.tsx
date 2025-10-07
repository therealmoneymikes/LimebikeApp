import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Alert, Linking } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { DrawerParamList } from "./_layout";
const { width, height } = Dimensions.get("window");

type Props = DrawerScreenProps<DrawerParamList, "index">;

export default function Map({ navigation }: Props) {
  const openDrawer = () => {
    // console.log("Navigation object:", navigation);
    // console.log("Trying to open drawer...");
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const [hasLocationPermssion, setHasLocationPermission] =
    useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

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

    console.log(`Lat: ${latitude}, Lon: ${longitude}`);

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
    backgroundColor: "gray",
    borderRadius: 20,
  },
});
