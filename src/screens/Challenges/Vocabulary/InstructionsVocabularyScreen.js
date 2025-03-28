import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InstructionsVocabularyScreen = ({ navigation }) => {
  useEffect(() => {
    // Hide the tab bar when this screen is active
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary Instructions</Text>
      </View> */}
      
      <View style={styles.card}>
        <Text style={styles.title}>Word Association Challenge</Text>
        <Text style={styles.description}>
          Enhance your vocabulary by associating words with their definitions or synonyms. Test your knowledge and improve your language skills!
        </Text>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.howToPlayTitle}>How to play:</Text>
          <Text style={styles.howToPlay}>
            • You will be presented with a word{'\n'}
            • Choose the correct synonym from a list within the time limit{'\n'}
            • Score points for each correct answer{'\n'}
            • Complete levels to earn badges and rewards{'\n'}
            • Level up your learning!
          </Text>
        </View>

        <View style={styles.durationContainer}>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Beginner - 20 seconds</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Intermediate - 30 seconds</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Advanced - 40 seconds</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('VocabularyChallenge')}>
        <Text style={styles.startButtonText}>Start Challenge</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4FF', // Light background color for the screen
  },
  header: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#00008B', // Dark blue header background
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500', // Orange color for the header text
  },
  card: {
    backgroundColor: '#FFFFFF', // White background for the card
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#F5F5F5', // Light grey background for instructions box
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  howToPlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  howToPlay: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  durationContainer: {
    marginTop: 10,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: '#00008B', // Dark blue button
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InstructionsVocabularyScreen;
