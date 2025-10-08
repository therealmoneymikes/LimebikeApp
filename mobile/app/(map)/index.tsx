import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Linking,
  TextInput,
} from "react-native";
import MapView, {
  Marker,
  Region,
  PROVIDER_GOOGLE,
  MapStyleElement,
} from "react-native-maps";
import * as Location from "expo-location";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import CustomPressable from "@/components/BaseComponents/CustomPressable";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import mapConfigs from "@/config/mapConfigs";
import AppText from "@/components/BaseComponents/AppText";
import { BarCodeScanner } from "expo-barcode-scanner";
import colours from "@/config/colours";
import LimeBikeSearchModal from "@/components/Modals/LimeBikeSearchModal";
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
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

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

  const handleQRCode = async () => {};

  const handleSearch = () => {
    setOpenSearchModal(true);
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
          right: 10,
          bottom: "50%",
          zIndex: 10,
          alignItems: "center",
          justifyContent: "center",
          rowGap: 20,
          backgroundColor: "#1e1e1e",
          height: 200,
          width: 60,
          borderRadius: 20,
        }}
      >
        {/* Navy Blue */}

        <View style={{ gap: 2 }}>
          {/* #202c3e, "#b91212" - rED, GRAYBLUE - #2a3859 */}
          <CustomPressable
            style={[styles.actionBtn, { backgroundColor: "#2a3859" }]}
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

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: "0%",
          height: "35%",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#fff",
        }}
      >
        {/* Scan Buttons */}
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            justifyContent: "space-around",
            bottom: "105%",
            width: "100%",
          }}
        >
          {/* Ride together */}
          <CustomPressable
            onPress={() => console.log("Ride together")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "#e0e0e0",
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
              columnGap: 8,
              opacity: 0.8,
            }}
          >
            <MaterialCommunityIcons name="account" size={30} />
            <AppText input="Ride Together" fontWeight={300} />
          </CustomPressable>
          {/* QR Code */}
          <CustomPressable
            onPress={handleQRCode}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "#e0e0e0",
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
              columnGap: 8,
              width: "35%",
              opacity: 0.9,
            }}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={28} />
            <AppText input="Scan" fontSize={16} fontWeight={300} />
          </CustomPressable>
        </View>

        {/* Inner Bottom Tabs */}
        <View style={{ padding: 20, rowGap: 13 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
              marginBottom: 5,
            }}
          >
            <AppText
              input="Where to, Lime rider?"
              fontSize={26}
              fontWeight={300}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#B3D8FF",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <AppText
                input="BETA"
                color="#4762E6"
                fontWeight={600}
                fontSize={14}
              />
            </View>
            <MaterialCommunityIcons name="information-outline" size={24} />
          </View>

          {/* Search */}
          <View
            style={{
              height: 50,
              padding: 10,
              borderRadius: 12,
              borderWidth: 2.5,
              borderColor: "#EDEEF2",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MaterialIcons name="search" size={28} color="#7A7A7C" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="gray"
              onFocus={handleSearch}
              onPressIn={() => setOpenSearchModal(true)}
              editable={false}
              style={{width: "100%", height: "100%", paddingLeft: 2}}
            />
          </View>

          {/* Ad */}
          <View
            style={{
              backgroundColor: "#E5FFE6",
              borderRadius: 20,
              flexDirection: "column",
              marginTop: 10,
              padding: 20,
              rowGap: 10,
            }}
          >
            <AppText
              input="Save 40% or more with LimePass"
              fontWeight={700}
              fontSize={16}
            />
            <AppText
              input="Get discounted minutes and unlimited free unlocks - no subscription required"
              fontSize={16}
            />
            <CustomPressable
              style={{
                backgroundColor: "#9FC9A1",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                width: "30%",
                paddingHorizontal: 10,
                paddingVertical: 12,
              }}
              onPress={() => console.log("Go to add mins screen")}
            >
              <AppText input="Add minutes" fontSize={12} fontWeight={700} />
            </CustomPressable>
          </View>
        </View>
      </View>
      {/* Where to, Lime Rider Modal */}
      {openSearchModal && (
        <LimeBikeSearchModal
          visible={openSearchModal}
          onClose={() => {
            setOpenSearchModal(false);
          }}
        />
      )}
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
    top: "3%",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    opacity: 0.8,
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
