import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../../config/apiConfig';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const themes = {
  beginner: [{
    category: 'Daily Life',
    prompts: [
      { story: "Write about finding a lost pet in your neighborhood", image: "Create an illustration of a {pet} lost in a {location}. The {pet} should look {emotion}. Style: {artStyle}, {colors}.", title: "The Lost Pet" },
    ]
  }],
  intermediate: [{
    category: 'Adventure',
    prompts: [
      { story: "Write about discovering a secret garden", image: "Create an illustration of a magical garden with {features} at {timeOfDay}. Style: {artStyle}, {colors}.", title: "The Secret Garden" },
    ]
  }],
  advanced: [{
    category: 'Fantasy',
    prompts: [
      { story: "Write about a city in the clouds", image: "Create an illustration of a floating city with {features} and {atmosphere}. Style: {artStyle}, {colors}.", title: "Sky City" },
    ]
  }]
};

const variations = {
  pet: ['puppy', 'kitten', 'bunny', 'hamster', 'parrot', 'guinea pig', 'small dog', 'friendly cat'],
  location: ['park', 'school yard', 'busy street', 'quiet neighborhood', 'shopping center', 'playground', 'community garden', 'local market'],
  emotion: ['worried but hopeful', 'slightly confused but friendly', 'curious and approachable', 'gentle and lost', 'tired but determined'],
  artStyle: ['digital art', 'watercolor', 'cartoon', 'hand-drawn', 'pastel', 'pencil sketch', 'minimalist', 'vibrant illustration'],
  colors: ['warm colors', 'soft pastels', 'vibrant colors', 'earthy tones', 'cool blues and greens', 'muted naturals', 'bright and cheerful'],
  features: ['glowing flowers and butterflies', 'ancient ruins and mysterious symbols', 'floating crystals and light beams', 'bioluminescent creatures', 'mechanical gears and steam pipes', 'mystical portals and energy streams', 'enchanted trees with glowing leaves', 'floating islands connected by light bridges'],
  timeOfDay: ['sunset', 'dawn', 'midnight', 'golden hour', 'twilight', 'misty morning', 'starlit night'],
  atmosphere: ['misty atmosphere', 'magical aura', 'ethereal glow', 'dramatic lighting', 'mysterious shadows', 'sparkling particles', 'swirling energy', 'rainbow aurora']
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateDynamicPrompt = (template) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variations[key] ? getRandomElement(variations[key]) : match;
  });
};

const CollapsibleScoreHistory = ({ scoreHistory }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = new Animated.Value(0);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderLevelScores = (levelName, scores) => (
    <View key={levelName} style={styles.levelScores}>
      <Text style={styles.levelTitle}>
        {levelName.charAt(0).toUpperCase() + levelName.slice(1)}
      </Text>
      {scores.map((score, index) => (
        <View key={index} style={styles.challengeScore}>
          <Text style={styles.challengeTitle}>Challenge {index + 1}:</Text>
          <View>
            {score.writing !== null && (
              <Text style={[styles.scoreText, { color: score.writing >= 6 ? '#4caf50' : '#f44336' }]}>
                Writing: {score.writing}/10
              </Text>
            )}
            {score.speaking !== null && (
              <Text style={[styles.scoreText, { color: score.speaking >= 6 ? '#4caf50' : '#f44336' }]}>
                Speaking: {score.speaking}/10
              </Text>
            )}
            {score.writing === null && score.speaking === null && (
              <Text style={styles.notAttempted}>Not attempted yet</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const RecordingMic = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    dotAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => {
      pulseAnim.stopAnimation();
      dotAnims.forEach(anim => anim.stopAnimation());
    };
  }, []);

  return (
    <View style={styles.recordingContainer}>
      <View style={styles.micContainer}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
        <MaterialIcons name="mic" size={43} color="#00008B" />
      </View>
      <View style={styles.dotsContainer}>
        {dotAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }] }
            ]}
          />
        ))}
      </View>
      <Text style={styles.recordingText}>Recording in progress...</Text>
      <Text style={styles.instructionText}>Speak clearly into your microphone</Text>
    </View>
  );
};

const LevelSelection = ({ onSelectLevel, completedLevels }) => {
  const levels = [
    { id: 'beginner', title: 'Beginner', color: '#00008B' },
    { id: 'intermediate', title: 'Intermediate', color: '#00008B' },
    { id: 'advanced', title: 'Advanced', color: '#00008B' }
  ];

  return (
    <View style={styles.levelSelectionContainer}>
      <Text style={styles.levelSelectionTitle}>Choose Practice Level</Text>
      {levels.map((level) => {
        const isCompleted = completedLevels[level.id];
        return (
          <Pressable
            key={level.id}
            style={[styles.levelButton, { backgroundColor: level.color }, isCompleted && styles.completedLevel]}
            onPress={() => onSelectLevel(level.id)}>
            <Text style={styles.levelButtonText}>{level.title}</Text>
            {isCompleted && (
              <View style={styles.starContainer}>
                {[...Array(3)].map((_, i) => (
                  <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
                ))}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const RewardAnimation = ({ visible, type, onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.rewardContainer,
        {
          opacity: fadeAnim,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000
        }
      ]}
    >
      {type === 'success' ? (
        <View style={styles.starsContainer}>
          {[...Array(3)].map((_, i) => (
            <Animatable.View key={i} animation="bounceIn" delay={i * 200} style={styles.starWrapper}>
              <MaterialIcons name="star" size={50} color="#FFD700" />
            </Animatable.View>
          ))}
        </View>
      ) : (
        <Animatable.Text animation="bounce" style={styles.emojiText}>😢</Animatable.Text>
      )}
    </Animated.View>
  );
};

const FluencyChallengeScreen = () => {
  const [level, setLevel] = useState('beginner');
  const [story, setStory] = useState('');
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [timer, setTimer] = useState(120);
  const [feedback, setFeedback] = useState('');
  const [writingScore, setWritingScore] = useState(null);
  const [speakingScore, setSpeakingScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [recordingSubmitted, setRecordingSubmitted] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [hasPassingWritingScore, setHasPassingWritingScore] = useState(false);
  const [hasPassingSpeakingScore, setHasPassingSpeakingScore] = useState(false);
  const [showLevelSelection, setShowLevelSelection] = useState(true);
  const [completedLevels, setCompletedLevels] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState('');
  const [currentPrompts, setCurrentPrompts] = useState({
    imagePrompts: {},
    challengeTitles: {},
    storyPrompts: {}
  });
  const [scoreHistory, setScoreHistory] = useState({
    beginner: [{ writing: null, speaking: null }],
    intermediate: [{ writing: null, speaking: null }],
    advanced: [{ writing: null, speaking: null }]
  });

  const getInitialTimer = (level) => {
    switch (level) {
      case 'beginner': return 120;
      case 'intermediate': return 600;
      case 'advanced': return 1200;
      default: return 120;
    }
  };

  useEffect(() => {
    const generatePrompts = () => {
      const levelThemes = themes[level][0].prompts;
      const newImagePrompts = {};
      const newChallengeTitles = {};
      const newStoryPrompts = {};

      const prompt = levelThemes[0];
      newImagePrompts[1] = generateDynamicPrompt(prompt.image);
      newChallengeTitles[1] = prompt.title;
      newStoryPrompts[1] = prompt.story;

      setCurrentPrompts({
        imagePrompts: newImagePrompts,
        challengeTitles: newChallengeTitles,
        storyPrompts: newStoryPrompts
      });
    };

    generatePrompts();
    setTimer(getInitialTimer(level));
  }, [level]);

  useEffect(() => {
    generateImage();
  }, [currentPrompts]);

  useEffect(() => {
    if (writingScore >= 6) {
      setHasPassingWritingScore(true);
    }
    if (speakingScore >= 6) {
      setHasPassingSpeakingScore(true);
    }

    if (hasPassingWritingScore || hasPassingSpeakingScore) {
      handleProgression();
    }
  }, [writingScore, speakingScore, hasPassingWritingScore, hasPassingSpeakingScore]);

  const generateImage = async () => {
    setImageLoading(true);
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: currentPrompts.imagePrompts[1],
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      if (response.data?.[0]?.url) {
        setGeneratedImageUrl(response.data[0].url);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleLevelSelection = (selectedLevel) => {
    setLevel(selectedLevel);
    setShowLevelSelection(false);
    resetState();
  };

  const handleLevelComplete = async (selectedLevel, writingScore, speakingScore) => {
    try {
      const savedScores = await AsyncStorage.getItem('challengeScores');
      const allScores = savedScores ? JSON.parse(savedScores) : { vocabulary: [], coherence: [], fluency: [] };
      allScores.fluency.push({ difficulty: selectedLevel, writingScore: writingScore, speakingScore: speakingScore });
      await AsyncStorage.setItem('challengeScores', JSON.stringify(allScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleLevelCompletion = async () => {
    if (hasPassingWritingScore || hasPassingSpeakingScore) {
      setRewardType('success');
      setCompletedLevels(prev => ({
        ...prev,
        [level]: true
      }));
      await handleLevelComplete(level, writingScore, speakingScore);
    } else {
      setRewardType('failure');
    }
    setShowReward(true);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingStopped(false);
    } catch (err) {
      Alert.alert('Failed to start recording', err.message);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      setIsRecording(false);
      setRecordingStopped(true);
      return uri;
    } catch (err) {
      Alert.alert('Failed to stop recording', err.message);
    }
  };

  const handleStopRecording = async () => {
    const audioUri = await stopRecording();
    setRecordingStopped(true);
  };

  const resetState = () => {
    setStorySubmitted(false);
    setRecordingSubmitted(false);
    setHasPassingWritingScore(false);
    setHasPassingSpeakingScore(false);
    setTimer(getInitialTimer(level));
    setStory('');
    setFeedback('');
    setWritingScore(null);
    setSpeakingScore(null);
    setRecordingStopped(false);
  };

  const getFeedbackAndScoreFromOpenAI = async (text, promptType) => {
    setLoading(true);
    try {
      const levelExpectations = {
        beginner: "Focus on basic storytelling elements and clear expression.",
        intermediate: "Look for more complex vocabulary and creative narrative elements.",
        advanced: "Expect sophisticated storytelling techniques and rich descriptive language."
      };

      const prompt = promptType === 'story'
        ? `As a creative writing teacher evaluating a ${level}-level student, please evaluate the following story considering these expectations: ${levelExpectations[level]}
           Story Prompt: "${currentPrompts.storyPrompts[1]}"
           Student's Story: "${text}"
           Please provide:
           1. A score out of 10 (considering the ${level} level expectations)
           2. Specific positive feedback highlighting strong points
           3. Level-appropriate suggestions for improvement
           4. A brief overall summary
           Format your response as:
           Score: [X]/10
           Strengths: [Your feedback]
           Areas for Improvement: [Your suggestions]
           Summary: [Brief overview]`
        : `As a speech and language expert evaluating a ${level}-level student, please evaluate the following narration considering these expectations: ${levelExpectations[level]}
           Narration: "${text}"
           Format your response as:
           Score: [X]/10
           Strengths: [Your feedback]
           Areas for Improvement: [Your suggestions]
           Summary: [Brief overview]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an experienced education professional providing constructive feedback on student work.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const feedbackText = completion.choices[0].message.content.trim();
      const scoreMatch = feedbackText.match(/Score:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

      setFeedback(feedbackText);
      if (promptType === 'story') {
        setWritingScore(score);
        if (score >= 6) setHasPassingWritingScore(true);
      } else if (promptType === 'narration') {
        setSpeakingScore(score);
        if (score >= 6) setHasPassingSpeakingScore(true);
      }
    } catch (error) {
      Alert.alert('Feedback Error', 'Unable to generate feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStory = () => {
    if (story.trim() || recordingStopped) {
      setStorySubmitted(true);
      getFeedbackAndScoreFromOpenAI(story || 'Audio recording submitted', recordingStopped ? 'narration' : 'story');
      if (recordingStopped) {
        setRecordingSubmitted(true);
      }
    } else {
      Alert.alert('Empty Submission', 'Please either write a story or record your voice before submitting.');
    }
  };

  const updateScoreHistory = (writingScore, speakingScore) => {
    setScoreHistory(prevHistory => ({
      ...prevHistory,
      [level]: [{ writing: writingScore, speaking: speakingScore }]
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleProgression = () => {
    if (hasPassingWritingScore || hasPassingSpeakingScore) {
      updateScoreHistory(writingScore, speakingScore);
      handleLevelCompletion();
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && !storySubmitted && !recordingSubmitted) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      Alert.alert('Time up!', `Your ${level === 'beginner' ? '2 minutes' : level === 'intermediate' ? '10 minutes' : '20 minutes'} are over.`);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, storySubmitted, recordingSubmitted, level]);

  if (showLevelSelection) {
    return <LevelSelection
      onSelectLevel={handleLevelSelection}
      completedLevels={completedLevels}
    />;
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.levelBadgeText}>Narrate a story with visuals</Text>

          <View style={styles.taskPromptContainer}>
            <Text style={styles.promptLabel}>Your Task:</Text>
            <Text style={styles.promptText}>{currentPrompts.storyPrompts[1]}</Text>
            <View style={styles.promptTips}>
              <MaterialIcons name="lightbulb-outline" size={20} color="#666" />
              <Text style={styles.tipsText}>
                {level === 'beginner' ? 'Focus on clear and simple storytelling' :
                 level === 'intermediate' ? 'Try to include more detailed descriptions' :
                 'Incorporate complex narrative elements and rich vocabulary'}
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            {imageLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976d2" />
                <Text style={styles.loadingText}>Generating image...</Text>
              </View>
            ) : generatedImageUrl ? (
              <Image source={{ uri: generatedImageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Image is still loading... Hold on !!😇</Text>
              </View>
            )}
          </View>

          <View style={styles.timeDisplayContainer}>
            <Text style={[styles.timerText, (storySubmitted || recordingSubmitted) && styles.timerTextComplete]}>
              Time Left: {!storySubmitted && !recordingSubmitted ? formatTime(timer) : 'Challenge Complete!'}
            </Text>
          </View>

          <View style={styles.storyInputContainer}>
            <Text style={styles.label}>Your Story</Text>
            <TextInput
              style={[styles.textInput, storySubmitted && styles.textInputDisabled]}
              placeholder="Write your story here..."
              value={story}
              onChangeText={setStory}
              multiline
              numberOfLines={4}
              editable={!storySubmitted}
            />
            <View style={styles.wordCountContainer}>
              <Text style={styles.wordCountText}>
                {story.trim().split(/\s+/).filter(Boolean).length} words
              </Text>
            </View>
          </View>

          <Text style={styles.modalTitle}>Record Your Story</Text>
          <View style={styles.recordingControlsContainer}>
            {!isRecording ? (
              <>
                <Text style={styles.recordingInstructions}>
                  Tell your story out loud to practice speaking
                </Text>
                <Pressable
                  style={[styles.recordButton, recordingSubmitted && styles.buttonDisabled]}
                  onPress={startRecording}
                  disabled={recordingSubmitted}
                >
                  <MaterialIcons name="mic" size={24} color="#ffc031" />
                  <Text style={styles.buttonText}>
                    {recordingSubmitted ? 'Recording Submitted' : 'Start Recording'}
                  </Text>
                </Pressable>
                {recordingSubmitted && (
                  <View style={styles.submissionStatus}>
                    <MaterialIcons name="check-circle" size={20} color="#4caf50" />
                    <Text style={styles.submissionStatusText}>Recording submitted successfully</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <RecordingMic />
                <Pressable
                  style={styles.stopButton}
                  onPress={handleStopRecording}
                >
                  <MaterialIcons name="stop" size={24} color="white" />
                  <Text style={styles.buttonText}>Stop Recording</Text>
                </Pressable>
              </>
            )}
          </View>

          <Pressable
            style={[
              styles.submitButton,
              (!story.trim() && !recordingStopped) && styles.buttonDisabled,
              (loading || storySubmitted) && styles.buttonDisabled
            ]}
            onPress={handleSubmitStory}
            disabled={(!story.trim() && !recordingStopped) || loading || storySubmitted}
          >
            <Text style={styles.buttonText}>
              {storySubmitted ? 'Story Submitted' : 'Submit Story'}
            </Text>
          </Pressable>

          {feedback && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Feedback:</Text>
              <Text style={styles.feedback}>{feedback}</Text>
              <View style={styles.scoresContainer}>
                {writingScore !== null && (
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Writing Score:</Text>
                    <View style={styles.scoreValueContainer}>
                      <Text style={[styles.scoreValue, {color: writingScore >= 6 ? '#4caf50' : '#f44336'}]}>
                        {writingScore}
                      </Text>
                      <Text style={styles.scoreMaximum}>/10</Text>
                    </View>
                  </View>
                )}
                {speakingScore !== null && (
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Speaking Score:</Text>
                    <View style={styles.scoreValueContainer}>
                      <Text style={[styles.scoreValue, {color: speakingScore >= 6 ? '#4caf50' : '#f44336'}]}>
                        {speakingScore}
                      </Text>
                      <Text style={styles.scoreMaximum}>/10</Text>
                    </View>
                  </View>
                )}
              </View>
              {(writingScore >= 6 || speakingScore >= 6) && (
                <View style={styles.congratsMessage}>
                  <MaterialIcons name="stars" size={24} color="#ffd700" />
                  <Text style={styles.congratsText}>
                    Congratulations! You've passed this level!
                  </Text>
                </View>
              )}
            </View>
          )}

          <CollapsibleScoreHistory scoreHistory={scoreHistory} />

          <RewardAnimation
            visible={showReward}
            type={rewardType}
            onComplete={() => {
              setShowReward(false);
            }}
          />

          {loading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color="#1976d2" />
                <Text style={styles.loadingText}>Generating feedback...</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4FAFF',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#F4FAFF',
  },
  levelBadge: {
    alignItems: 'center',
  },
  levelBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  challengeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  currentChallengeDot: {
    backgroundColor: '#1976d2',
    transform: [{ scale: 1.2 }],
  },
  completedChallengeDot: {
    backgroundColor: '#4caf50',
  },
  challengeCountText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  feedbackContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  feedback: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  taskPromptContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00008B',
  },
  promptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  promptTips: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  tipsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timeDisplayContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginVertical: 4,
  },
  timerTextComplete: {
    color: '#4caf50',
  },
  timerSubtext: {
    fontSize: 14,
    color: '#666',
  },
  storyInputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  textInputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  wordCountContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  wordCountText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#00008B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recordingControlsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButton: {
    backgroundColor: '#00008B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#00008B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 15,
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    marginVertical: 10,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 139, 0.2)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginHorizontal: 9,
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
  },
  recordingInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submissionStatusText: {
    marginLeft: 8,
    color: '#4caf50',
    fontSize: 14,
  },
  scoresContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreMaximum: {
    fontSize: 16,
    color: '#666',
    marginLeft: 2,
  },
  congratsMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  congratsText: {
    marginLeft: 8,
    color: '#166534',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
  },
  levelSelectionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F4FAFF',
  },
  levelSelectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  levelButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedLevel: {
    opacity: 0.8,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rewardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starWrapper: {
    margin: 10,
  },
  emojiText: {
    fontSize: 80,
  }
});

export default FluencyChallengeScreen;
