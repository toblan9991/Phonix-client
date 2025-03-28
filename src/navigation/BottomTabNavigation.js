// src/navigation/BottomTabNavigation.js - first
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import DashboardNavigator from './DashboardNavigator';
// import DashboardScreen from '../screens/Dashboard/DashboardScreen';
// // import { HomeActive, HomeInactive } from '../components/BottomNavigation/Icons';

// const Tab = createBottomTabNavigator();

// const BottomTabNavigation = () => {
//     return (
//         <Tab.Navigator
//             // screenOptions={({ route }) => ({
//             //     tabBarIcon: ({ color, focused, size }) => {
//             //         if (route.name === "Dashboard") {
//             //             return focused ? <HomeActive size={size} color={color} /> : <HomeInactive size={size} color={color} />;
//             //         }
//             //         // Add other tabs if needed
//             //     },
//             //     tabBarActiveTintColor: "black",
//             //     tabBarInactiveTintColor: "gray",
//             //     tabBarIconStyle: { fontSize: 14 },
//             //     headerShown: false,
//             // })}
//         >
//             <Tab.Screen 
//             name="Dashboard" 
//             component={DashboardScreen} 
//             options={{ headerTitle: "Home" }} 
//             />
//         </Tab.Navigator>
//     );
// };

// export default BottomTabNavigation;
