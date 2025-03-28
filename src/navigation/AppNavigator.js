import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import DashboardNavigator from "./DashboardNavigator";
//import HomeScreen from "../screens/HomeScreen";
import LearningStackNavigator from "./LearningStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import ChallengesStack from "../stacks/ChallengesStack"
import SpeechTrackingStackScreen from "../stacks/SpeechTrackingStack";

import HomeActiveIcon from '../../assets/icons/HomeActive.png';
import HomeInactiveIcon from '../../assets/icons/HomeInactive.png';
import SpeakActiveIcon from '../../assets/icons/SpeakActive.png';
import SpeakInactiveIcon from '../../assets/icons/SpeakInactive.png';
import LearnActiveIcon from '../../assets/icons/LearnActive.png';
import LearnInactiveIcon from '../../assets/icons/LearnInactive.png';
import ChallengeActiveIcon from '../../assets/icons/ChallengeActive.png';
import ChallengeInactiveIcon from '../../assets/icons/ChallengeInactive.png';
import ProfileActiveIcon from '../../assets/icons/ProfileActive.png';
import ProfileInactiveIcon from '../../assets/icons/ProfileInactive.png';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
    
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTitle: "",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#F4FAFF",
        },
        headerTintColor: "#F4FAFF",

        tabBarStyle: {
          backgroundColor: "#F4FAFF",
          borderTopWidth: 1,
          borderTopColor: "#dcdcdc",
          height: 80,
        },
        tabBarLabelStyle: {
          // fontSize: 12,
          fontWeight: "600",
        },
        
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
            case "Home":
              iconSource = focused ? HomeActiveIcon : HomeInactiveIcon;
              break;
            case "Speak":
              iconSource = focused ? SpeakActiveIcon : SpeakInactiveIcon;
              break;
            case "Learning":
              iconSource = focused ? LearnActiveIcon : LearnInactiveIcon;
              break;
            case "Challenges":
              iconSource = focused ? ChallengeActiveIcon : ChallengeInactiveIcon;
              break;
            case "Profile":
              iconSource = focused ? ProfileActiveIcon : ProfileInactiveIcon;
              break;
            default:
              iconSource = HomeInactiveIcon;
          }

          return <Image source={iconSource} style={styles.icon} />;
        },

        tabBarActiveTintColor: "#02006C",
        tabBarInactiveTintColor: "gray",
      })}
    >
       <Tab.Screen 
      name="Home"
      component={DashboardNavigator}
      options={{ tabBarLabel: "Home" }} />
      
      <Tab.Screen
        name="Speak"
        component={SpeechTrackingStackScreen}
        options={{ tabBarLabel: "Speak" }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningStackNavigator}
        options={{ tabBarLabel: "Learning" }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesStack}
        options={{ tabBarLabel: "Challenges" }}
      /> 
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default AppNavigator;







