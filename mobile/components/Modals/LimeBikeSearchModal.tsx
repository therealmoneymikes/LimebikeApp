import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomPressable from "../BaseComponents/CustomPressable";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../BaseComponents/AppText";
import { TextInput } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("screen");
interface LimeBikeSearchModalProps {
  visible: boolean;
  onClose: () => void;
}
const LimeBikeSearchModal = ({
  visible,
  onClose,
}: LimeBikeSearchModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="fullScreen"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            height: "85%", // 60–70% of screen height
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            rowGap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10
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

          {/* Search Bar*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              borderRadius: 14,
              height: 50,
              paddingHorizontal: 10,
              columnGap: 10
            }}
          >
            <FontAwesome name="dot-circle-o" size={28} color="black" />
           
            <TextInput placeholder="Search for places..." placeholderTextColor="gray" style={{fontSize: 16}} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LimeBikeSearchModal;

const styles = StyleSheet.create({});
