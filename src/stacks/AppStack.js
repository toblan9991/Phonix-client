import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import SpeechTrackingScreen from "../components/Screens/SpeechTracking/SpeechTracking"
// import LearningModuleScreen from '../components/Screens/LearningModule/LearningModuleScreen'
import SpeechTrackingStackScreen from './SpeechTrackingStack'
const Stack = createNativeStackNavigator()

const AppStack = () => (
  <NavigationContainer>
    <Stack.Navigator>
      {/* <Stack.Screen
        name='Index'
        component={IndexScreen}
        options={{
          title: 'Recipe App',
          headerStyle: {
            backgroundColor: '#2c3e50'
          },
          headerTitleStyle: {
            color: '#fff'
          }
        }}
      /> */}
      <Stack.Screen component={SpeechTrackingStackScreen} />
      <Stack.Screen name='Learning' component={LearningModuleScreen} />

      {/* <Stack.Screen
        name='Web'
        component={WebScreen}
        options={({ route }) => ({
          title: route.params.label,
          headerBackTitle: 'Back to Show'
        })}
      /> */}
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppStack