import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InstructionsCoherenceScreen = ({ navigation }) => {
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
   <View style={styles.card}>
        <Text style={styles.title}>Word Ordering Challenge</Text>
        <Text style={styles.description}>
          Test your coherence skills by arranging words in the correct logical order to make a sentence. Improve your understanding of how ideas flow and connect!
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.howToPlayTitle}>How to play:</Text>
          <Text style={styles.howToPlay}>
            • You will be presented with a set of words.{'\n'}
            • Drag and drop the words to arrange them in the correct order.{'\n'}
            • Score points for each correct arrangement.{'\n'}
            • Complete levels to earn badges and rewards.
          </Text>
        </View>

        <View style={styles.durationContainer}>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Beginner - 30 seconds</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Intermediate - 40 seconds</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Advanced - 50 seconds</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('CoherenceChallenge')}>
        <Text style={styles.startButtonText}>Start Challenge</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4FF', 
  },
  header: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#00008B', 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500', 
  },
  card: {
    backgroundColor: '#FFFFFF', 
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
    backgroundColor: '#F5F5F5', 
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
    backgroundColor: '#00008B', 
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

export default InstructionsCoherenceScreen;
