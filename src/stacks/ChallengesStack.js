import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChallengesScreen from '../screens/Challenges/ChallengesScreen.js';
import InstructionsVocabularyScreen from '../screens/Challenges/Vocabulary/InstructionsVocabularyScreen.js';
import VocabularyChallengeScreen from '../screens/Challenges/Vocabulary/VocabularyChallengeScreen.js';
import InstructionsCoherenceScreen from '../screens/Challenges/Coherence/InstructionsCoherenceScreen.js';
import CoherenceChallengeScreen from '../screens/Challenges/Coherence/CoherenceChallengeScreen.js';
import InstructionsFluencyScreen from '../screens/Challenges/Fluency/InstructionsFluencyScreen.js';
import FluencyChallengeScreen from '../screens/Challenges/Fluency/FluencyChallengeScreen.js';
const Stack = createStackNavigator();
function ChallengesStack() {
  return (
    <Stack.Navigator
      initialRouteName="Challenges"
      screenOptions={{
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
     backgroundColor: '#00008B'
  },
  headerTitleStyle: {
    color: '#FFC031',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTintColor: '#FFC031',
  headerSafeAreaInsets: { top: 0 },
  contentStyle: {
    backgroundColor: '#FFFFFF'
  }
}}
    >
      <Stack.Screen
        name="Challenges"
        component={ChallengesScreen}
      />
      {/* Vocabulary Screens */}
      <Stack.Screen
        name="InstructionsVocabulary"
        component={InstructionsVocabularyScreen}
        options={{ title: 'Vocabulary Instructions', headerBackTitle: ' '}}
      />
      <Stack.Screen
        name="VocabularyChallenge"
        component={VocabularyChallengeScreen}
        options={{ title: 'Vocabulary Challenge', headerBackTitle: ' ', tabBarStyle: { display: 'none' } }}
      />
      {/* Coherence Screens */}
      <Stack.Screen
        name="InstructionsCoherence"
        component={InstructionsCoherenceScreen}
        options={{ title: 'Coherence Instructions',headerBackTitle: ' ' }}
      />
      <Stack.Screen
        name="CoherenceChallenge"
        component={CoherenceChallengeScreen}
        options={{ title: 'Coherence Challenge' ,headerBackTitle: ' '}}
      />
      {/* Fluency Screens */}
      <Stack.Screen
        name="InstructionsFluency"
        component={InstructionsFluencyScreen}
        options={{ title: 'Fluency Instructions' ,headerBackTitle: ' '}}
      />
      <Stack.Screen
        name="FluencyChallenge"
        component={FluencyChallengeScreen}
        options={{ title: 'Fluency Challenge' ,headerBackTitle: ' '}}
      />
    </Stack.Navigator>
  );
}
export default ChallengesStack;