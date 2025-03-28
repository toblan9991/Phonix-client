
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Animated, ScrollView, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY } from '../../../config/apiConfig';
import { Video } from 'expo-av';

const VOCABULARY_CONFIG = {
  beginner: {
    timeLimit: 20,
    nextLevel: 'intermediate',
    pointsPerQuestion: 10,
    maxWrongAnswers: 2,
    topics: ['food and taste words', 'basic actions', 'emotions', 'descriptions', 'everyday activities'],
    vocabularyLevel: 'A1-A2'
  },
  intermediate: {
    timeLimit: 30,
    nextLevel: 'advanced',
    pointsPerQuestion: 10,
    maxWrongAnswers: 2,
    topics: ['work and management', 'social interactions', 'academic life', 'travel and leisure', 'current events'],
    vocabularyLevel: 'B1-B2'
  },
  advanced: {
    timeLimit: 40,
    nextLevel: null,
    pointsPerQuestion: 10,
    maxWrongAnswers: 2,
    topics: ['academic and scientific language', 'business and economics', 'arts and literature', 'politics and society', 'technology'],
    vocabularyLevel: 'C1-C2'
  }
};

const VOCABULARY_PROMPTS = {
  beginner: `You are a language teacher creating synonym-based MCQ exercises for English learners.
Create exactly 3 vocabulary questions testing basic English synonyms for beginners (CEFR {vocabularyLevel}).
Requirements:
- Use common, everyday words with basic synonyms
- Focus on one-word synonyms (avoid phrases)
- Include simple context clues
- Provide 4 options per question
- Use familiar vocabulary that beginners would know
- Include simple explanations showing word relationships
Return them in this EXACT JSON format:
[{
  "question": "The cake was very _____ (similar to: delicious).",
  "options": ["tasty", "cold", "hard", "small"],
  "correctAnswer": "tasty",
  "explanation": "'Tasty' and 'delicious' are similar words that describe food that has good flavor.",
  "difficulty": "beginner",
  "topic": "food and taste words"
}]`,
  intermediate: `You are a language teacher creating synonym-based MCQ exercises for intermediate English learners.
Create exactly 3 vocabulary questions testing English synonyms for intermediate learners (CEFR {vocabularyLevel}).
Requirements:
- Use medium-frequency words and common phrasal verbs
- Include context-dependent synonyms
- Test subtle differences between similar words
- Provide 4 options per question with plausible distractors
- Include some common idiomatic expressions
- Explain nuanced differences between synonyms
Return them in this EXACT JSON format:
[{
  "question": "The project manager needs to _____ (similar to: supervise) the team's progress carefully.",
  "options": ["monitor", "watch", "see", "look"],
  "correctAnswer": "monitor",
  "explanation": "'Monitor' and 'supervise' both mean to oversee something carefully, but 'monitor' specifically implies tracking progress over time.",
  "difficulty": "intermediate",
  "topic": "work and management"
}]`,
  advanced: `You are a language teacher creating synonym-based MCQ exercises for advanced English learners.
Create exactly 3 vocabulary questions testing advanced English synonyms for advanced learners (CEFR {vocabularyLevel}).
Requirements:
- Use sophisticated academic and literary vocabulary
- Include context-sensitive synonym pairs
- Test precise shade of meaning between near-synonyms
- Provide 4 options with sophisticated distractors
- Include formal and technical vocabulary
- Explain subtle connotative differences between synonyms
Return them in this EXACT JSON format:
[{
  "question": "The professor's _____ (similar to: hypothesis) challenged existing theories in the field.",
  "options": ["postulation", "statement", "idea", "thought"],
  "correctAnswer": "postulation",
  "explanation": "While both 'postulation' and 'hypothesis' refer to theoretical propositions, 'postulation' specifically emphasizes the act of suggesting or assuming something as a basis for reasoning.",
  "difficulty": "advanced",
  "topic": "academic and scientific language"
}]`
};

const Star = ({ filled, animated, crying }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 1.2,
          useNativeDriver: true,
          friction: 3
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3
        })
      ]).start();

      if (crying) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true
            }),
            Animated.timing(rotateValue, {
              toValue: -1,
              duration: 1000,
              useNativeDriver: true
            })
          ])
        ).start();
      }
    }
  }, [animated, crying]);

  const rotate = rotateValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-20deg', '20deg']
  });

  return (
    <Animated.View
      style={[
        styles.starContainer,
        {
          transform: [
            { scale: scaleValue },
            { rotate: crying ? rotate : '0deg' }
          ]
        }
      ]}
    >
      <Text style={[styles.star, filled ? styles.filledStar : styles.emptyStar]}>
        {crying ? '😢' : '⭐'}
      </Text>
    </Animated.View>
  );
};

const LevelCompletionModal = ({ visible, stars, score, totalScore, onContinue, onRetry, isSuccess }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animatable.View 
          animation="zoomIn"
          duration={900}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>
            {isSuccess ? 'Level Completed!' : 'Level Failed'}
          </Text>
          
          <View style={styles.starsContainer}>
            {isSuccess ? (
              [...Array(3)].map((_, index) => (
                <Star
                  key={index}
                  filled={true}
                  animated={true}
                  crying={false}
                />
              ))
            ) : (
              <Star
                filled={false}
                animated={true}
                crying={true}
              />
            )}
          </View>

          {/* {isSuccess && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Level Score: {score}</Text>
              <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
            </View>
          )} */}

          <Text style={styles.modalText}>
            {isSuccess 
              ? 'Congratulations! You can move to the next level!'
              : 'You need more practice. Try again!'}
          </Text>

          <TouchableOpacity
            style={[styles.modalButton, isSuccess ? styles.successButton : styles.retryButton]}
            onPress={isSuccess ? onContinue : onRetry}
          >
            <Text style={styles.modalButtonText}>
              {isSuccess ? 'Continue' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const LevelSelection = ({ onLevelSelect }) => {
  return (
    <View style={styles.levelSelectionContainer}>
      <Text style={styles.levelSelectionTitle}>Choose Practice Level</Text>
      <TouchableOpacity
        style={styles.levelButton}
        onPress={() => onLevelSelect('beginner')}
      >
        <Text style={styles.levelButtonText}>Beginner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.levelButton}
        onPress={() => onLevelSelect('intermediate')}
      >
        <Text style={styles.levelButtonText}>Intermediate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.levelButton}
        onPress={() => onLevelSelect('advanced')}
      >
        <Text style={styles.levelButtonText}>Advanced</Text>
      </TouchableOpacity>
    </View>
  );
};

const CollapsibleHeader = ({ selectedLevel, score, levelScore }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 180],
  });

  return (
    <Animated.View style={[styles.headerContainer, { height: heightInterpolate }]}>
      <TouchableOpacity 
        style={styles.headerTop}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>Word Association Challenge</Text>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: animation,
            display: isExpanded ? 'flex' : 'none'
          }
        ]}
      >
        <ScrollView>
          <Text style={styles.statItem}>
            Level: {selectedLevel?.charAt(0).toUpperCase() + selectedLevel?.slice(1)}
          </Text>
          <Text style={styles.statItem}>Total Score: {score}</Text>
          <Text style={styles.statItem}>Current Level Score: {levelScore}</Text>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const VocabularyChallengeScreen = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const intervalRef = useRef(null);

  const handleLevelComplete = async () => {
    try {
      const savedScores = await AsyncStorage.getItem('challengeScores');
      const allScores = savedScores ? JSON.parse(savedScores) : {
        vocabulary: [],
        coherence: [],
        fluency: []
      };
      
      allScores.vocabulary.push({
        difficulty: selectedLevel,
        wrongAnswers: wrongAnswers,
        score: levelScore,
        totalQuestions: challenges.length,
        pointsPerQuestion: VOCABULARY_CONFIG[selectedLevel].pointsPerQuestion,
        completedAt: new Date().toISOString(),
        timePerQuestion: timer,
        correctAnswers: challenges.length - wrongAnswers,
        accuracy: ((challenges.length - wrongAnswers) / challenges.length * 100).toFixed(2),
        topics: challenges.map(challenge => challenge.topic)
      });
      
      await AsyncStorage.setItem('challengeScores', JSON.stringify(allScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generatePrompt = (level, topic) => {
    const config = VOCABULARY_CONFIG[level];
    return VOCABULARY_PROMPTS[level].replace('{vocabularyLevel}', config.vocabularyLevel);
  };

  const fetchChallenges = async (level) => {
    const config = VOCABULARY_CONFIG[level];
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
            { role: "system", content: "You are a specialized language learning assistant that creates synonym-based vocabulary quiz questions." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return [{
        question: "The food was very _____ (similar to: delicious).",
        options: ["tasty", "cold", "hard", "small"],
        correctAnswer: "tasty",
        explanation: "'Tasty' and 'delicious' are similar words that describe food that has good flavor.",
        difficulty: level,
        topic: "food and taste words"
      }];
    }
  };

  const handleLevelSelect = async (level) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setWrongAnswers(0);
    setIsLoading(true);
    setLevelScore(0);
    try {
      const newChallenges = await fetchChallenges(level);
      setChallenges(newChallenges);
      setChallengeIndex(0);
      setTimer(VOCABULARY_CONFIG[level].timeLimit);
    } catch (error) {
      Alert.alert('Error', 'Failed to load challenges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (challenges.length > 0 && challengeIndex < challenges.length) {
      setChallenge(challenges[challengeIndex]);
      setTimer(VOCABULARY_CONFIG[selectedLevel].timeLimit);
      setIsAnswered(false);
      setFeedback(null);
      setSelectedOption(null);
      setCanSubmit(false);
    }
  }, [challenges, challengeIndex]);

  useEffect(() => {
    if (challenge && timer > 0 && !isAnswered) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleTimeUp();
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

  const handleTimeUp = () => {
    setWrongAnswers(prev => prev + 1);
    setFeedback(`Time's up! The correct answer was "${challenge.correctAnswer}". ${challenge.explanation}`);
    setIsAnswered(true);
    setCanSubmit(false);
    Alert.alert(
      'Time\'s Up!',
      `The correct answer was: ${challenge.correctAnswer}`,
      [{ text: 'Continue', onPress: handleNextChallenge }]
    );
  };

  const handleOptionSelect = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setCanSubmit(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption && !isAnswered) {
      const config = VOCABULARY_CONFIG[selectedLevel];
      const isCorrect = selectedOption === challenge.correctAnswer;

      if (isCorrect) {
        setFeedback(`Correct! ${challenge.explanation}`);
        setLevelScore(prev => prev + config.pointsPerQuestion);
        setScore(prev => prev + config.pointsPerQuestion);
      } else {
        setWrongAnswers(prev => prev + 1);
        setFeedback(`Incorrect. The correct answer is "${challenge.correctAnswer}". ${challenge.explanation}`);
      }

      setIsAnswered(true);
      setCanSubmit(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const handleNextChallenge = () => {
    if (isAnswered) {
      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex(prev => prev + 1);
      } else {
        const isSuccess = wrongAnswers <= VOCABULARY_CONFIG[selectedLevel].maxWrongAnswers;
        if (isSuccess) {
          handleLevelComplete();
        }
        setShowCompletionModal(true);

        if (isSuccess) {
          setTimeout(() => {
            setShowCompletionModal(false);
            setGameStarted(false);
            setSelectedLevel(null);
          }, 3000);
        }
      }
    }
  };

  const handleRetry = async () => {
    setShowCompletionModal(false);
    setWrongAnswers(0);
    setLevelScore(0);
    setChallengeIndex(0);
    setIsLoading(true);
    
    try {
      const newChallenges = await fetchChallenges(selectedLevel);
      setChallenges(newChallenges);
      setTimer(VOCABULARY_CONFIG[selectedLevel].timeLimit);
      setIsAnswered(false);
      setFeedback(null);
      setSelectedOption(null);
      setCanSubmit(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load challenges. Please try again.');
      setGameStarted(false);
      setSelectedLevel(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameStarted) {
    return <LevelSelection onLevelSelect={handleLevelSelect} />;
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
        {/* <View style={styles.videoOverlay} /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CollapsibleHeader
        selectedLevel={selectedLevel}
        score={score}
        levelScore={levelScore}
      />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {challenge ? (
          <View style={styles.bottomContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Choose the synonym for the word provided</Text>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{challenge.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {challenge.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption,
                    isAnswered && option === challenge.correctAnswer && styles.correctOption,
                    isAnswered && selectedOption === option && option !== challenge.correctAnswer && styles.incorrectOption,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                >
                  <Text style={[
                    styles.optionText,
                    (isAnswered && option === challenge.correctAnswer) && styles.correctOptionText,
                    (isAnswered && selectedOption === option && option !== challenge.correctAnswer) && styles.incorrectOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, { color: timer <= 10 ? 'red' : 'black' }]}>
                Time Left: {formatTime(timer)}
              </Text>
            </View>

            {!isAnswered && (
              <TouchableOpacity
                style={[styles.submitButton, !canSubmit && styles.disabledButton]}
                onPress={handleSubmitAnswer}
                disabled={!canSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>
            )}

            {feedback && (
              <Text style={[
                styles.feedbackText,
                feedback.includes('Correct') ? styles.correctFeedback : styles.incorrectFeedback,
              ]}>
                {feedback}
              </Text>
            )}

            {isAnswered && (
              <TouchableOpacity
                style={styles.nextQuestionButton}
                onPress={handleNextChallenge}
              >
                <Text style={styles.nextQuestionButtonText}>Next Question</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text>No questions available</Text>
        )}
      </ScrollView>

      <LevelCompletionModal
        visible={showCompletionModal}
        score={levelScore}
        totalScore={score}
        onContinue={() => setShowCompletionModal(false)}
        onRetry={handleRetry}
        isSuccess={wrongAnswers <= VOCABULARY_CONFIG[selectedLevel]?.maxWrongAnswers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FAFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  levelSelectionContainer: {
    flex: 1,
    backgroundColor: '#F4FAFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  levelSelectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  levelButton: {
    backgroundColor: '#000080',
    width: '100%',
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  levelButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  levelDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: 'DM Sans',
  },
  headerContainer: {
    overflow: 'hidden',
    marginTop: 13,  
    position: 'absolute', 
    top: 0,  
    left: 0,
    right: 0,
  },
  headerTop: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 0,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  statsContainer: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 10,
  },
  statItem: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#00008B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 0,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  bottomContainer: {
    width: '100%',
  },
  titleContainer: {
    paddingTop: 19,
    marginBottom: 8,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'medium',
    fontFamily: 'DM Sans',
  },
  questionContainer: {
    backgroundColor: '#F7F8F9', 
    padding: 12,
    marginVertical: 6,
    borderRadius: 12, 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, 
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
    fontFamily: 'DM Sans',
  },
  optionsContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F7F8F9', 
    borderRadius: 12,
    elevation: 2,
    marginVertical: 6,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#BBDEFB',
    borderColor: '#000080',
  },
  correctOption: {
    backgroundColor: '#C8E6C9',
    borderColor: '#2E7D32',
  },
  incorrectOption: {
    backgroundColor: '#FFCDD2',
    borderColor: '#C62828',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  correctOptionText: {
    color: '#2E7D32',
  },
  incorrectOptionText: {
    color: '#C62828',
  },
  timerContainer: {
    marginVertical: 8,
  },
  timerText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  submitButton: {
    backgroundColor: '#000080',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 0,
    elevation: 1,
    fontFamily: 'DM Sans',
  },
  correctFeedback: {
    color: '#2E7D32',
  },
  incorrectFeedback: {
    color: '#C62828',
  },
  nextQuestionButton: {
    backgroundColor: '#000080',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
  },
  nextQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    elevation: 5,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000080',
    fontFamily: 'DM Sans',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
    fontFamily: 'DM Sans',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  starContainer: {
    marginHorizontal: 5,
  },
  star: {
    fontSize: 40,
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#D3D3D3',
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  successButton: {
    backgroundColor: '#00008B',
    borderRadius: 4,
  },
  retryButton: {
    backgroundColor: '#00008B',
    borderRadius: 4,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  scoreContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#000080',
    marginVertical: 5,
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F4FAFF',
  },
  video: {
    width: 500, 
    height: 500, 
   // backgroundColor: '#fff',
   //backgroundColor: '#D3D3D3',
   // backgroundColor: '#F4FAFF',
  },
  // videoOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
  // },
});

export default VocabularyChallengeScreen;

