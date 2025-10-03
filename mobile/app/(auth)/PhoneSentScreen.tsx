import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomPressable from '@/components/BaseComponents/CustomPressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import AppText from '@/components/BaseComponents/AppText';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;
const PhoneSentScreen = () => {
     const data = useLocalSearchParams()

     const [value, setValue] = useState("");
     const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
     const [props, getCellOnLayoutHandler] = useClearByFocusCell({
       value,
       setValue,
     });

     
    
    return (
      <View style={styles.baseContainer}>
        <View
          style={{
            borderRadius: 50,
            backgroundColor: "gray",
            padding: 10,
            width: 40,
          }}
        >
          <CustomPressable
            onPress={() => {
              router.navigate("/(auth)/OtherOptionsScreen");
              console.log(
                "Navigate from Other Options Screen to SignInUpScreen"
              );
            }}
          >
            <MaterialCommunityIcons name="arrow-left" color="black" size={20} />
          </CustomPressable>
        </View>

        {/* Enter Code */}
        <View style={{ gap: 5 }}>
          <AppText
            input="Enter the code that we sent to"
            fontSize={26}
            fontWeight="500"
          />
          <AppText input={`${data.phone}`} fontSize={26} color="gray" fontWeight="400"/>
        </View>

       
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
     

        {/* Didn't Receive Hyperlink */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          <AppText input="Didn't receive it?" fontSize={16} />
          {/* #58ED8D */}
          <CustomPressable onPress={() => console.log("Resend")}>
            <AppText input="Resend code" fontSize={16} color="green" />
          </CustomPressable>
        </View>
      </View>
    );
}

export default PhoneSentScreen

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FAF9F6",
    paddingTop: Constants.statusBarHeight,
    rowGap: 20,
  },
  root: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  codeFieldRoot: { marginTop: 20, justifyContent: "space-between" },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    borderRadius: 8,
  },
  focusCell: {
    borderColor: "#000",
  },
});