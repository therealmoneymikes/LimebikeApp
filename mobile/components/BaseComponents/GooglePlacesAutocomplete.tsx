// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import * as Location from "expo-location";
// import haversine from "haversine";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// export default function LocationSearch() {
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [distance, setDistance] = useState<number | null>(null);

//   // Get user's current location on mount
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }

//       const { coords } = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//       });
//     })();
//   }, []);

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <GooglePlacesAutocomplete
//         placeholder="Search for a place"
//         fetchDetails={true}
//         onPress={(data, details = null) => {
//           if (!details || !userLocation) return;

//           const placeLocation = {
//             latitude: details.geometry.location.lat,
//             longitude: details.geometry.location.lng,
//           };

//           const dist = haversine(userLocation, placeLocation, { unit: "km" });
//           setDistance(dist);

//           console.log(
//             `User is ${dist.toFixed(2)} km away from ${data.description}`
//           );
//         }}
//         query={{
//           key: process.env.GOOGLE_MAPS_API_KEY,
//           language: "en",
//           components: "country:gb", // restrict to UK
//         }}
//         styles={{
//           container: { flex: 0 },
//           textInputContainer: { width: "100%" },
//           listView: { backgroundColor: "#fff" },
//         }}
//       />

//       {distance !== null && (
//         <Text style={styles.distanceText}>
//           Distance from your location: {distance.toFixed(2)} km
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   distanceText: {
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
