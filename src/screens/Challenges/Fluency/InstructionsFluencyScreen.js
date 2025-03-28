import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InstructionsFluencyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Fluency Challenge</Text>
      </View> */}

      <View style={styles.card}>
        <Text style={styles.title}>Storytelling with Visual Prompts</Text>
        <Text style={styles.description}>
          Challenge yourself with Storytelling! Choose to write or record your narrative inspired by the visual prompts.
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.howToPlayTitle}>How to play:</Text>
          <Text style={styles.howToPlay}>
            1. Look at the visual prompts provided.{'\n'}
            2. Think creatively about the story you want to tell.{'\n'}
            3. Write or record your story.{'\n'}
            4. Narrate your idea clearly and fluently.
          </Text>
        </View>

        <View style={styles.durationContainer}>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Beginner - 2 minutes</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Intermediate - 5-10 minutes</Text>
          </View>
          <View style={styles.levelItem}>
            <MaterialIcons name="timer" size={20} color="black" />
            <Text style={styles.durationText}>Advanced - 10-15 minutes</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('FluencyChallenge')}>
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

export default InstructionsFluencyScreen;
