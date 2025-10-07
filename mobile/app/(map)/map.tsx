import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Alert, Linking } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Link } from "expo-router";

const { width, height } = Dimensions.get("window");

//For map styling use snazzy maps
export default function Map() {
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

    setHasLocationPermission(true)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
    });
    const { latitude, longitude } = location.coords;

    console.log(`Lat: ${latitude}, Lon: ${latitude}`);

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
        provider={PROVIDER_GOOGLE} //Need provider google for Android My location to work
        style={styles.map}
        initialRegion={
          userLocation ?? {
            latitude: 51.5074, // Example: London
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
});
