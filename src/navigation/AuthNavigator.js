import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Authentication/LoginScreen";
import SignupScreen from "../screens/Authentication/SignupScreen";
import FirstScreen from "../screens/Authentication/FirstScreen";
import { RippleAnimation } from "../animation/RippleAnimation";
import OnboardingScreen1 from "../screens/Onboarding/OnboardingScreen1";
import OnboardingScreen2 from "../screens/Onboarding/OnboardingScreen2";
import OnboardingScreen3 from "../screens/Onboarding/OnboardingScreen3";
import OnboardingScreen4 from '../screens/Onboarding/OnboardingScreen4';
import OnboardingScreen5 from '../screens/Onboarding/OnboardingScreen5';
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#F4FAFF',
        },
        headerTintColor: '#000000',
      }}
    >
      {/* Splash Screen - No header */}
      <Stack.Screen
        name="Splash"
        component={RippleAnimation}
        options={{ headerShown: false }}
      />
      {/* Authentication and Onboarding Screens */}
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
      <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
      <Stack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
      <Stack.Screen name="OnboardingScreen5" component={OnboardingScreen5} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;





