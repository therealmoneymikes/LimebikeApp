import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import CustomPressable from "../BaseComponents/CustomPressable";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../BaseComponents/AppText";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import haversine from "haversine";
import * as Location from "expo-location";

const { height, width } = Dimensions.get("screen");

interface LimeBikeSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const LimeBikeSearchModal = ({
  visible,
  onClose,
}: LimeBikeSearchModalProps) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Get user's current location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
      propagateSwipe
    >
      <View
        style={{
          height: "85%",
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          rowGap: 10,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <CustomPressable
            onPress={onClose}
            style={{
              width: 30,
              height: 30,
              backgroundColor: "gray",
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: "0%",
            }}
          >
            <MaterialCommunityIcons name="close" size={20} />
          </CustomPressable>
          <View>
            <AppText
              input="Where to, Lime rider?"
              fontSize={26}
              fontWeight={300}
            />
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 2,
            borderRadius: 14,
            paddingHorizontal: 10,
            columnGap: 10,
          }}
        >
          <FontAwesome name="dot-circle-o" size={28} color="black" />

          {/* Autocomplete */}
          <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
              placeholder="Search for a place"
              fetchDetails={true}
              onPress={(data, details) => {
                if (!details || !userLocation) return;

                const placeLocation = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };

                const dist = haversine(userLocation, placeLocation, {
                  unit: "km",
                });
                setDistance(dist);

                console.log(
                  `User is ${dist.toFixed(2)} km away from ${data.description}`
                );
              }}
              query={{
                // To get your own API key for GOOGLE_MAPS
                // Signup and/or sign into in Google Cloud Plaform (APIS & Credentials -> Create Credentials -> Copy and Paste API_KEY into ENV (DO INCLUDE IT RAW, PUT IN A .env File ))
                // Link -> https://console.cloud.google.com/
                key: process.env.GOOGLE_MAPS_API_KEY, // replace with your key
                language: "en",
                components: "country:gb",
              }}
              enablePoweredByContainer={false}
              onFail={(error) => console.error("Autocomplete error:", error)}
              onNotFound={() => console.log("No results found")}
              requestUrl={{
                useOnPlatform: "all",
                url: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
              }}
              // This might help:
              textInputProps={{
                onChangeText: (text) => {
                  console.log("Input text:", text);
                },
              }}
              styles={{
                container: { flex: 1 },
                textInputContainer: {
                  backgroundColor: "transparent",
                  padding: 0,
                },
                textInput: { fontSize: 16, padding: 0 },
                listView: {
                  backgroundColor: "white",
                  position: "absolute",
                  top: 50,
                  zIndex: 1000,
                },
              }}
              keyboardShouldPersistTaps="handled"
            />

            {distance !== null && (
              <Text style={styles.distanceText}>
                Distance from your location: {distance.toFixed(2)} km
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LimeBikeSearchModal;

const styles = StyleSheet.create({
  distanceText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
