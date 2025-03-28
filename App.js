// // App.js - correct
// import React from "react";
// import { NativeBaseProvider } from "native-base";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { AuthProvider } from "./src/context/AuthContext";
// import RootNavigator from "./src/navigation/RootNavigator";
// import { NavigationContainer } from "@react-navigation/native";
// import { LogBox } from "react-native";
// import { StatusBar } from "expo-status-bar";
// // import { GluestackUIProvider } from "@gluestack-ui/themed";
// import { StyleSheet, Text } from "react-native";
// // import "@/global.css";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { config } from "@gluestack-ui/config";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import AppStack from "./src/stacks/AppStack";
// import SpeechTrackingStackScreen from "./src/stacks/SpeechTrackingStack";
// import HomeStackScreen from "./src/stacks/HomeStackScreen";

// const Tab = createBottomTabNavigator();

// LogBox.ignoreAllLogs(true);

// const App = () => {
//   console.log("App component rendered");

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NativeBaseProvider>
//         <AuthProvider>
//           <RootNavigator />
//           {/* <AudioRecorder />r */}
//         </AuthProvider>
//       </NativeBaseProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;






// App.js 
import React from "react";
import { NativeBaseProvider } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs(true);

const App = () => {
  console.log("App component rendered");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default App;
