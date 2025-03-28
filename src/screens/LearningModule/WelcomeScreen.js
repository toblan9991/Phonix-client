import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import AuthContext from '../../context/AuthContext';

export default function WelcomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({
      title: 'Learning',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#02006C',
        height: 60,
      },
      headerTitleStyle: {
        color: '#ffc031',
        fontSize: 18,
        fontWeight: 'bold',
      },
      headerBackVisible: false,
    });
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('Learning Modules');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f4faff" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Welcome to Learning!</Text>
        <Text style={styles.subtitle}>
          Improve your fluency, vocabulary, and coherence with guided lessons.
        </Text> */}

        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>AI Analysis</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Fluency</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressPercentage}></Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Vocabulary</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill1} />
            </View>
            <Text style={styles.progressPercentage}></Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Coherence</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill2} />
            </View>
            <Text style={styles.progressPercentage}></Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggested Focus Area</Text>
          <View style={styles.focusAreaItem}>
            <Text style={styles.checkmark}>✔</Text>
            <Text style={styles.focusAreaText}>Practice fluency exercises</Text>
          </View>
          <View style={styles.focusAreaItem}>
            <Text style={styles.checkmark}>✔</Text>
            <Text style={styles.focusAreaText}>Expand vocabulary in specific topics</Text>
          </View>
          <View style={styles.focusAreaItem}>
            <Text style={styles.checkmark}>✔</Text>
            <Text style={styles.focusAreaText}>
              Improve coherence in speech structure
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4faff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4faff',
  },
  card: {
    width: '106%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  focusAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkmark: {
    fontSize: 18,
    color: '#02006C',
    marginRight: 10,
  },
  focusAreaText: {
    fontSize: 14,
    color: '#5A5A5A',
    flex: 1,
  },
  analysisContainer: {
    width: '106%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressLabel: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: '#5A5A5A',
  },
  progressBar: {
    flex: 3,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressFill: {
    width: '85%',
    height: '100%',
    backgroundColor: '#ffc031',
    borderRadius: 5,
  },
  progressFill1: {
    width: '90%',
    height: '100%',
    backgroundColor: '#ffc031',
    borderRadius: 5,
  },
  progressFill2: {
    width: '88%',
    height: '100%',
    backgroundColor: '#ffc031',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 16,
    color: '#5A5A5A',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#02006C',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5A5A5A',
    marginBottom: 30,
    textAlign: 'center',
  },
  // button: {
  //   backgroundColor: '#02006C',
  //   paddingVertical: 15,
  //   paddingHorizontal: 40,
  //   borderRadius: 10,
  // },
  // buttonText: {
  //   color: '#FFC031',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  button: {
    width: '106%',
    margin: 20,
    backgroundColor: '#02006C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
