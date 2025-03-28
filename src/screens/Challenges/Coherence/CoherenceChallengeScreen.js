import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, Animated } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY } from '../../../config/apiConfig';
import { Video } from 'expo-av';

const AnimatedStar = ({ delay }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={{
        fontSize: 50,
        transform: [{ scale: scaleValue }],
        marginHorizontal: 5,
      }}
    >
      ⭐
    </Animated.Text>
  );
};

const StarAnimation = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <AnimatedStar delay={0} />
    <AnimatedStar delay={200} />
    <AnimatedStar delay={400} />
  </View>
);

const SENTENCE_CONFIG = {
  beginner: {
    timeLimit: 30,
    nextLevel: 'intermediate',
    pointsPerQuestion: 10,
    requiredAccuracy: 0.8,
    minParts: 3,
    maxParts: 4,
    topics: ['daily activities', 'family', 'hobbies', 'weather', 'food']
  },
  intermediate: {
    timeLimit: 40,
    nextLevel: 'advanced',
    pointsPerQuestion: 10,
    requiredAccuracy: 0.8,
    minParts: 4,
    maxParts: 5,
    topics: ['work life', 'education', 'technology', 'entertainment', 'travel']
  },
  advanced: {
    timeLimit: 50,
    nextLevel: null,
    pointsPerQuestion: 10,
    requiredAccuracy: 0.8,
    minParts: 5,
    maxParts: 7,
    topics: ['business', 'science', 'global issues', 'philosophy', 'culture']
  }
};

const COHERENCE_PROMPTS = {
  beginner: `Create 2 simple English sentences about {topic} for beginners.
Each sentence should have {minParts}-{maxParts} parts, using simple present or present continuous tense.
Use basic vocabulary and common expressions.

Return ONLY a JSON array in this format:
[{
  "sentenceParts": ["runs", "the dog", "fast"],
  "correctOrder": [1, 0, 2],
  "originalSentence": "the dog runs fast",
  "difficulty": "beginner",
  "topic": "daily activities"
}]`,
  intermediate: `Create 2 English sentences about {topic} with moderate complexity.
Each sentence should have {minParts}-{maxParts} parts, using varied tenses.
Include dependent clauses and sophisticated vocabulary.

Return ONLY a JSON array in this format:
[{
  "sentenceParts": ["in the garden", "plants flowers", "my mother", "every spring"],
  "correctOrder": [2, 1, 0, 3],
  "originalSentence": "my mother plants flowers in the garden every spring",
  "difficulty": "intermediate",
  "topic": "hobbies"
}]`,
  advanced: `Create 2 complex English sentences about {topic}.
Each sentence should have {minParts}-{maxParts} parts, using advanced tenses and complex structures.
Include sophisticated vocabulary and academic expressions.

Return ONLY a JSON array in this format:
[{
  "sentenceParts": ["the complex project", "despite the challenges", "ahead of schedule", "the team completed", "efficiently"],
  "correctOrder": [1, 3, 0, 4, 2],
  "originalSentence": "despite the challenges the team completed the complex project efficiently ahead of schedule",
  "difficulty": "advanced",
  "topic": "business"
}]`
};

const DEFAULT_CHALLENGES = [{
  sentenceParts: ["the dog", "runs", "in the park"],
  correctOrder: [0, 1, 2],
  originalSentence: "the dog runs in the park",
  difficulty: "beginner",
  topic: "daily activities"
}];

const CoherenceChallengeScreen = () => {
  const [showLevelSelection, setShowLevelSelection] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [data, setData] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(30);
  const [showTimeOutPopup, setShowTimeOutPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(null);
  const intervalRef = useRef(null);

  const generatePrompt = (level, topic) => {
    const config = SENTENCE_CONFIG[level];
    return COHERENCE_PROMPTS[level]
      .replace('{topic}', topic)
      .replace('{minParts}', config.minParts)
      .replace('{maxParts}', config.maxParts);
  };

  const handleLevelComplete = async () => {
    try {
      const savedScores = await AsyncStorage.getItem('challengeScores');
      const allScores = savedScores ? JSON.parse(savedScores) : { vocabulary: [], coherence: [], fluency: [] };

      allScores.coherence.push({
        difficulty: selectedLevel,
        score: levelScore,
        totalQuestions: challenges.length,
        pointsPerQuestion: SENTENCE_CONFIG[selectedLevel].pointsPerQuestion
      });

      await AsyncStorage.setItem('challengeScores', JSON.stringify(allScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const fetchChallenges = async (level) => {
    setIsLoading(true);
    const config = SENTENCE_CONFIG[level];
    const topic = config.topics[Math.floor(Math.random() * config.topics.length)];
    const prompt = generatePrompt(level, topic);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a language learning assistant that creates sentence arrangement exercises. Respond only with valid JSON arrays containing the exercises." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      try {
        const parsedContent = JSON.parse(data.choices[0].message.content.trim());
        if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
          setChallenges(DEFAULT_CHALLENGES);
        } else {
          const validChallenges = parsedContent.filter(challenge =>
            challenge.sentenceParts &&
            Array.isArray(challenge.sentenceParts) &&
            challenge.correctOrder &&
            Array.isArray(challenge.correctOrder) &&
            challenge.originalSentence &&
            challenge.difficulty &&
            challenge.topic
          );
          setChallenges(validChallenges.length > 0 ? validChallenges : DEFAULT_CHALLENGES);
        }
      } catch (parseError) {
        setChallenges(DEFAULT_CHALLENGES);
      }
    } catch (apiError) {
      setChallenges(DEFAULT_CHALLENGES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setShowLevelSelection(false);
    fetchChallenges(level);
  };

  useEffect(() => {
    if (challenges.length > 0 && challengeIndex < challenges.length) {
      const currentChallenge = challenges[challengeIndex];
      setChallenge(currentChallenge);
      setData(
        currentChallenge.sentenceParts.map((part, index) => ({
          key: `${index}`,
          content: part,
        }))
      );
      setTimer(SENTENCE_CONFIG[selectedLevel].timeLimit);
      setIsAnswered(false);
      setFeedback(null);
      setSelectedItems({});
    }
  }, [challenges, challengeIndex]);

  useEffect(() => {
    if (challenge && timer > 0 && !isAnswered) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setFeedback('Time is up!');
            setIsAnswered(true);
            setShowTimeOutPopup(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer, isAnswered, challenge]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isAnswered}
          style={[
            styles.sentenceContainer,
            {
              backgroundColor: isActive ? '#FFF' :
                selectedItems[item.key] === 'correct' ? '#90EE90' :
                selectedItems[item.key] === 'incorrect' ? '#FFB6C1' :
                selectedItems[item.key] === 'selected' ? '#fff' : '#fff',
              elevation: isActive ? 5 : 0
            }
          ]}
        >
          <Text style={styles.sentenceText}>{item.content}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const canAdvanceToNextLevel = (currentScore, totalQuestions) => {
    const config = SENTENCE_CONFIG[selectedLevel];
    const accuracy = currentScore / (totalQuestions * config.pointsPerQuestion);
    return accuracy >= config.requiredAccuracy;
  };

  const handleComplete = () => {
    const userAnswer = data.map(item => item.content);
    const correctOrder = challenge.correctOrder;
    const config = SENTENCE_CONFIG[selectedLevel];
    let isCorrect = true;
    const updatedSelectedItems = {};

    data.forEach((item, index) => {
      const correctIndex = correctOrder[index];
      if (userAnswer[index] === challenge.sentenceParts[correctIndex]) {
        updatedSelectedItems[item.key] = 'correct';
      } else {
        updatedSelectedItems[item.key] = 'incorrect';
        isCorrect = false;
      }
    });

    setSelectedItems(updatedSelectedItems);

    if (isCorrect) {
      setFeedback('Correct! Well done!');
      setLevelScore(prev => prev + config.pointsPerQuestion);
      setScore(prev => prev + config.pointsPerQuestion);
    } else {
      setFeedback(`Incorrect! The correct sentence is:\n${challenge.originalSentence}`);
    }

    setIsAnswered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleRestartChallenge = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowTimeOutPopup(false);
    setIsAnswered(false);
    setFeedback(null);
    setTimer(SENTENCE_CONFIG[selectedLevel].timeLimit);
  };

  const handleNextChallenge = async () => {
    if (isAnswered) {
      setShowTimeOutPopup(false);

      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex(prev => prev + 1);
      } else {
        if (canAdvanceToNextLevel(levelScore, challenges.length)) {
          await handleLevelComplete();
          setCompletionStatus('success');
          setShowCompletionModal(true);
          setTimeout(() => {
            setShowCompletionModal(false);
            setShowLevelSelection(true);
            setChallengeIndex(0);
            setLevelScore(0);
          }, 3000);
        } else {
          await handleLevelComplete();
          setCompletionStatus('failure');
          setShowCompletionModal(true);
          setTimeout(() => {
            setShowCompletionModal(false);
            setChallengeIndex(0);
            setLevelScore(0);
            fetchChallenges(selectedLevel);
          }, 3000);
        }
      }
    }
  };

  if (showLevelSelection) {
    return (
      <View style={styles.container}>
        <View style={styles.levelSelectionContainer}>
          <Text style={styles.title}>Choose Practice Level</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => handleLevelSelect('beginner')}
            >
              <Text style={styles.levelText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => handleLevelSelect('intermediate')}
            >
              <Text style={styles.levelText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => handleLevelSelect('advanced')}
            >
             <Text style={styles.levelText}>Advanced</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Video
          source={require('../../../../assets/Processing_animation.mp4')}
          style={styles.video}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          isLooping
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Words Ordering Challenge</Text>
      {challenge ? (
        <>
          <Text style={styles.instructionText}>Drag the words into the correct order to form a coherent sentence:</Text>
          <View style={styles.listContainer}>
            <DraggableFlatList
              data={data}
              onDragEnd={({ data }) => setData(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderItem}
              containerStyle={{ flex: 1 }}
              disabled={isAnswered}
            />
          </View>

          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: timer <= 10 ? 'red' : 'black' }]}>
              Time Left: {formatTime(timer)}
            </Text>
          </View>

          {feedback && (
            <Text style={[
              styles.feedbackText,
              feedback.includes('Correct') ? styles.correctFeedback : styles.incorrectFeedback,
            ]}>
              {feedback}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, { opacity: isAnswered ? 0.5 : 1 }]}
              onPress={handleComplete}
              disabled={isAnswered}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, { opacity: !isAnswered ? 0.5 : 1 }]}
              onPress={handleNextChallenge}
              disabled={!isAnswered}
            >
              <Text style={styles.nextButtonText}>Next Challenge</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>No challenges available</Text>
      )}

      <Modal
        transparent={true}
        visible={showCompletionModal}
        animationType="fade"
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            {completionStatus === 'success' ? (
              <>
                <Text style={styles.popupTitle}>Congratulations!</Text>
                <StarAnimation />
                <Text style={styles.popupText}>You've completed this level!</Text>
              </>
            ) : (
              <Animatable.View animation="bounce" iterationCount="infinite">
                <Text style={[styles.popupTitle, { fontSize: 50 }]}>😢</Text>
                <Text style={styles.popupText}>Keep practicing! You'll get better!</Text>
              </Animatable.View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={showTimeOutPopup}
        animationType="fade"
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Time's Up!</Text>
            <Text style={styles.popupText}>Unfortunately, you ran out of time for this question.</Text>
            <View style={styles.popupButtonContainer}>
              <Button
                title="Retry Challenge"
                onPress={handleRestartChallenge}
                color="#4CAF50"
              />
              <Button
                title="Next Challenge"
                onPress={handleNextChallenge}
                color="#2196F3"
                disabled={!isAnswered}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#F4FAFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 500,
    height: 500,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'DM Sans',
  fontWeight: 'bold',
  marginTop: 15,
  marginBottom: 7,
  textAlign: 'center',
  color: '#000000',
  padding: 10,
  borderRadius: 0,
  width: 'auto',
  },
  // scorePanel: {
  //   backgroundColor: '#00008B',
  //   borderRadius: 10,
  //   padding: 15,
  //   marginBottom: 30,
  // },
  // levelSelectionContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '100%',
  //   backgroundColor : '#F4FAFF',
  // },
  // scorePanelHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // scorePanelText: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#FFFFFF',
  //   textAlign: 'center'
  // },
  // scoreDetails: {
  //   marginTop: 15,
  //   paddingTop: 15,
  //   borderTopWidth: 1,
  //   borderTopColor: '#e0e0e0',
  // },
  // scoreText: {
  //   fontSize: 16,
  //   marginBottom: 10,
  //   color: '#FFFFFF',
  // },
  levelButton: {
    backgroundColor: '#00008B',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#424242',
    marginVertical: 7,
    paddingLeft: 1.5,
    paddingRight: 1.5,

  },
  listContainer: {
    flex: 3,
    minHeight: 100,
    maxHeight: 300,
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 1,
  shadowRadius: 3,
  // Android-specific shadow
  elevation: 3,
  },
  sentenceContainer: {
    padding: 12,
    marginTop: 23,
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    // Android-specific shadow
    elevation: 3,
    borderWidth: 0,
    borderColor: '#BBDEFB',
    borderRadius: '4px',
    backgroundColor: '#FFF',
     // iOS shadow properties
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 3,
     // Android shadow with elevation
     elevation: 3,

  },
  sentenceText: {
    fontSize: 16,
    color: '#00000',
  },
  levelSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  levelButton: {
    backgroundColor: '#00008B',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
  },
  correctFeedback: {
    color: '#2E7D32',
    backgroundColor: '#C8E6C9',
    fontWeight: 'bold',
  },
  incorrectFeedback: {
    color: '#C62828',
    backgroundColor: '#FFCDD2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 20,
    gap: 15,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#00008B',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#00008B',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popupContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 15,
    textAlign: 'center',
  },
  popupText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginVertical: 10,
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
});

export default CoherenceChallengeScreen;
