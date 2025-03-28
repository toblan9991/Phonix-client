import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengesScreen = ({ navigation }) => {
  const [challengeScores, setChallengeScores] = useState({
    vocabulary: [],
    coherence: [],
    fluency: []
  });
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    loadPointsAndScores();
  }, []);

  useEffect(() => {
    calculateOverallProgress();
    saveScores();
  }, [challengeScores]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPointsAndScores();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPointsAndScores = async () => {
    try {
      const [savedScores, savedPoints] = await Promise.all([
        AsyncStorage.getItem('challengeScores'),
        AsyncStorage.getItem('userPoints')
      ]);
      
      if (savedScores) {
        setChallengeScores(JSON.parse(savedScores));
      }
      if (savedPoints) {
        setPoints(JSON.parse(savedPoints));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveScores = async () => {
    try {
      await AsyncStorage.setItem('challengeScores', JSON.stringify(challengeScores));
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  };

  const calculateOverallProgress = () => {
    const calculateChallengeProgress = (scores, type) => {
      if (!scores || !scores[type]) return 0;
      const levelScores = scores[type];
      let completedLevels = 0;
      
      const getPassingScore = (challengeType, level) => {
        switch (challengeType) {
          case 'vocabulary':
            const maxWrongAnswers = {
              beginner: 2,
              intermediate: 2,
              advanced: 2
            }[level.difficulty] || 2;
            return (level.wrongAnswers <= maxWrongAnswers) ? 1 : 0;
          case 'coherence':
            const totalPoints = level.score || 0;
            const maxPoints = level.totalQuestions * level.pointsPerQuestion;
            return (totalPoints / maxPoints >= 0.8) ? 1 : 0;
          case 'fluency':
            return (level.writingScore >= 6 || level.speakingScore >= 6) ? 1 : 0;
          default:
            return 0;
        }
      };

      levelScores.forEach(level => {
        completedLevels += getPassingScore(type, level);
      });

      return completedLevels / 3;
    };

    const vocabularyProgress = calculateChallengeProgress(challengeScores, 'vocabulary');
    const coherenceProgress = calculateChallengeProgress(challengeScores, 'coherence');
    const fluencyProgress = calculateChallengeProgress(challengeScores, 'fluency');
    
    let totalProgress = 0;
    let progressCount = 0;
    
    if (vocabularyProgress > 0 || coherenceProgress > 0 || fluencyProgress > 0) {
      totalProgress += Math.max(vocabularyProgress / 3, coherenceProgress / 3, fluencyProgress / 3) * 100;
      progressCount++;
    }
    
    const twoLevelCombinations = [
      (vocabularyProgress + coherenceProgress) / 2,
      (vocabularyProgress + fluencyProgress) / 2,
      (coherenceProgress + fluencyProgress) / 2
    ].filter(combo => combo > 0);
    
    if (twoLevelCombinations.length > 0) {
      totalProgress += Math.max(...twoLevelCombinations) * 100;
      progressCount++;
    }
    
    if (vocabularyProgress > 0 && coherenceProgress > 0 && fluencyProgress > 0) {
      totalProgress += ((vocabularyProgress + coherenceProgress + fluencyProgress) / 3) * 100;
      progressCount++;
    }
    
    const finalProgress = progressCount > 0 ? totalProgress / progressCount / 100 : 0;
    const progressValue = Math.min(Math.max(finalProgress, 0), 1);
    setProgress(progressValue);
    
    const calculatedPoints = Math.round(progressValue * 10000);
    setPoints(calculatedPoints);
    try {
      AsyncStorage.setItem('userPoints', JSON.stringify(calculatedPoints));
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  const totalCompletedLevels = Object.values(challengeScores).reduce((total, challengeType) => {
    return total + challengeType.length;
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <Text style={styles.header}>Challenges Categories</Text> */}

        <View style={[styles.card, styles.centerAlign]}>
          <Text style={styles.title}>Vocabulary Challenge</Text>
          <Text style={styles.subtitle}>Word Association Challenge</Text>
          <TouchableOpacity
            style={[styles.button, styles.customButtonStyle]}
            onPress={() => navigation.navigate('InstructionsVocabulary')}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.centerAlign]}>
          <Text style={styles.title}>Fluency Challenge</Text>
          <Text style={styles.subtitle}>Storytelling with Visual Prompts</Text>
          <TouchableOpacity
            style={[styles.button, styles.customButtonStyle]}
            onPress={() => navigation.navigate('InstructionsFluency')}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.centerAlign]}>
          <Text style={styles.title}>Coherence Challenge</Text>
          <Text style={styles.subtitle}>Word Ordering Challenge</Text>
          <TouchableOpacity
            style={[styles.button, styles.customButtonStyle]}
            onPress={() => navigation.navigate('InstructionsCoherence')}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.progressHeader}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
          </View>
          <ProgressBar progress={progress} color="#00008B" style={styles.progressBar} />
        </View>

        <View style={styles.badgesSection}>
          <View style={styles.badgesHeader}>
            <Text style={styles.badgesTitle}>Badges Earned</Text>
          </View>
          <View style={styles.badgesGrid}>
            {[...Array(Math.min(totalCompletedLevels, 3))].map((_, index) => (
              <View key={index} style={styles.badgeContainer}>
                <Image
                  source={require('../../../assets/badgeImage.png')}
                  style={styles.badgeImage}
                />
                <Text style={styles.badgeText}>
                  {index % 3 === 0 ? 'Champion' : index % 3 === 1 ? 'Pro Champ' : 'Master'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FAFF',
    fontFamily: 'DM Sans',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#00008B',
    color: 'gold',
    marginBottom: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerAlign: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00008B',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customButtonStyle: {
    display: 'flex',
    width: 100,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  progressHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#333',
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
  },
  badgesSection: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgesHeader: {
    marginBottom: 16,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badgeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
    textAlign: 'center',
  }
});

export default ChallengesScreen;