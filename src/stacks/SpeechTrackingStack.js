import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SpeechTrackingScreen from "../screens/SpeechTracking/SpeechTracking";
import { DetailsScreen } from "../screens/SpeechTracking/Details";
import FeedbackScreen from '../screens/SpeechTracking/FeedbackScreen';

const SpeechTrackingStack = createNativeStackNavigator();

function SpeechTrackingStackScreen() {
  return (
    <SpeechTrackingStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#02006C" },
        headerTitleStyle: {
          color: "#02006C", 
          
        }, 
      }}
    >
      <SpeechTrackingStack.Screen
      name="speak"
        component={SpeechTrackingScreen}
      />
      <SpeechTrackingStack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: "Try again", 
          headerShown: true, 
          headerStyle: { backgroundColor: "#F4FAFF" }, 
          headerTintColor: "black",
          headerBackTitleVisible: false, 
          headerTitleStyle: {
            color: "black",
             
          },
        }}
        />
      <SpeechTrackingStack.Screen name="Score" component={DetailsScreen}
      options={{
        headerStyle: { backgroundColor: "#F4FAFF" },
        headerTintColor: "black",
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: "black",
        }
      }} />
    </SpeechTrackingStack.Navigator>
  );
}

export default SpeechTrackingStackScreen;
