import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/LearningModule/WelcomeScreen';
import LearningScreen from '../screens/LearningModule/LearningScreen';
import ModuleScreen from '../screens/LearningModule/ModuleScreen';
import LessonScreen from '../screens/LearningModule/LessonScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const LearningStack = createNativeStackNavigator();

const LearningStackNavigator = () => {
  return (
    <LearningStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#f4faff" },
      headerTitleStyle: {
        marginTop: 10, 
        fontSize: 15,
      },
      headerTintColor: '#FFC031', 
        headerBackVisible: true, 
        headerBackTitleVisible: false,
    }}
    >
       <LearningStack.Screen 
        name="Learning" 
        component={WelcomeScreen} 
        options={{ title: '' }} 
      />

      <LearningStack.Screen 
        name="Learning Modules" 
        component={LearningScreen} 
        options={{ title: '' }} 
      />
      <LearningStack.Screen 
        name="Module" 
        component={ModuleScreen} 
        options={{ title: '' }} 
        initialParams={{ moduleName: '' }}
      />
      <LearningStack.Screen 
        name="Lesson" 
        component={LessonScreen} 
        options={{ title: '' }} 
        initialParams={{ chapterTitle: '', lessonNumber: 1 }}
      />
    </LearningStack.Navigator>
  );
};

export default LearningStackNavigator;
