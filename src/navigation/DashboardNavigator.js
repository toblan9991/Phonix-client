import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import ProgressGraphScreen from "../screens/Dashboard/ProgressGraphScreen";
import ProgressDetailsScreen from '../screens/Dashboard/ProgressDetailsScreen';


const Stack = createNativeStackNavigator();

const DashboardNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
             />

        <Stack.Screen
            name="ProgressGraphScreen"
            component={ProgressGraphScreen}
            options={{ headerShown: true ,
                headerTitle: "",
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#F4FAFF",
                  },}}
                
             />

<Stack.Screen
            name="ProgressDetailsScreen"
            component={ProgressDetailsScreen}
            options={{ headerShown: true ,
                headerTitle: "",
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#F4FAFF",
                  },}}
                
             />     
        </Stack.Navigator>
    )
};

export default DashboardNavigator;