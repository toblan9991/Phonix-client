import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen1 from "../screens/Onboarding/OnboardingScreen1";
import OnboardingScreen2 from "../screens/Onboarding/OnboardingScreen2";
import OnboardingScreen3 from "../screens/Onboarding/OnboardingScreen3";
import OnboardingScreen4 from "../screens/Onboarding/OnboardingScreen4";
import OnboardingScreen5 from "../screens/Onboarding/OnboardingScreen5";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#F4FAFF",
        },
        headerTintColor: "#000000",
      }}
    >
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
      <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
      <Stack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
      <Stack.Screen name="OnboardingScreen5" component={OnboardingScreen5} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
