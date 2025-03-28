import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#f4faff" },
      headerTitleStyle: {
        marginTop: 10, 
        fontSize: 15,
      },
    }}
    >
      <ProfileStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: '',
          headerShown: false,
        }} 
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: ''
        }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
