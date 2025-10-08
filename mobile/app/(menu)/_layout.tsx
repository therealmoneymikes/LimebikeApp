import { Stack } from "expo-router"




const MenuScreens = () => {
    return (
        <Stack>
            <Stack.Screen name="WalletScreen" options={{headerShown: false}}/>
        </Stack>
    )
}

export default MenuScreens