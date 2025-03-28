import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import {
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { Video } from "expo-av";
import axios from "axios"; // For making HTTP requests
import * as FileSystem from "expo-file-system";
import { OPENAI_API_KEY, BACKEND_PORT } from "../../config/apiConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Function to render speech with highlighted mistakes
const renderSpeechWithMistakes = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/); // Split text at **...**

  return parts.map((part, index) => {
    // Check if the part is a mistake (wrapped in **)
    if (part.startsWith("**") && part.endsWith("**")) {
      const correctedWord = part.slice(2, -2); // Remove the surrounding **
      return (
        <Text key={index} style={styles.mistakeText}>
          {correctedWord.toUpperCase()}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
};

const SpeechTrackingScreen = ({ route, navigation }) => {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [latestRecording, setLatestRecording] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = "6722f0124a61e306535d8e14";

  // Request microphone permission
  const getMicrophonePermission = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  };

  // Start recording
  const startRecording = async () => {
    try {
      const permission = await getMicrophonePermission();
      if (!permission) {
        alert("Please grant permission to access the microphone.");
        return;
      }

      // Prepare for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // Add the recording to the list
    // const { sound } = await recording.createNewLoadedSoundAsync();
    // setRecordings([...recordings, { sound, uri }]);

    // Creating a sound object from the latest recording
    const { sound } = await recording.createNewLoadedSoundAsync();
    setLatestRecording({ sound, uri });

    // Sending the audio file to Whisper API for transcription
    uploadAudioToWhisper(uri);
  };

  // Upload the audio file to Whisper API and get the transcription
  const uploadAudioToWhisper = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File doesn't exist");
      }

      // Prepare form data for Whisper API
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: "recording.m4a", // Ensure the file format is correct
        type: "audio/m4a", // MIME type for the format
      });
      formData.append("model", "whisper-1");
      formData.append("response_format", "text");

      // Send audio file to Whisper API
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log("API response:", response.data);
      setTranscription(response.data);
      getChatbotResponse(response.data);
    } catch (error) {
      console.error(
        "Error transcribing audio:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to transcribe the audio.");
    }
  };

  // Get chatbot response using the transcribed text
  const getChatbotResponse = async (transcribedText) => {
    try {
      if (!transcribedText) {
        throw new Error("Transcribed text is empty or undefined.");
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", // Or "gpt-4" if available
          messages: [
            {
              role: "system",
              content:
                "Evaluate my speech for overall grammatical structure. Highlight the words or phrases that need correction. example: user says:'My name is Bhawleen. I love coding in the morning, contrary to the norm that developers code at night. ' chatbot response:'We found 1 mistake. **Contrary**' highlight the words that need correction by displaying the speech again with **.give all mistakes in red color ",
            },
            {
              role: "user",
              content: transcribedText,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log(
        "Chatbot response:",
        response.data.choices[0].message.content
      );

      const chatbotFeedback = response.data.choices[0].message.content;

      setChatResponse(chatbotFeedback);
      // Navigate to the new screen
      navigation.navigate("Feedback", {
        chatResponse: chatbotFeedback,
        latestRecording,
      });
    } catch (error) {
      console.error(
        "Error getting chatbot response:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to get a response from the chatbot.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="#02006C"
        barStyle="light-content"
      />

      <View style={styles.TopHeader}>
        <Image
          source={require("../../../assets/Phonix-logo.png")} // Path to your custom icon
          style={styles.customIcon} // Custom style for your icon
        />
        <Text style={styles.TopHeaderText}>
          Press the icon to start recording
        </Text>
      </View>

      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={styles.iconButton}
      >
        <Image
          source={
            recording
              ? require("../../../assets/stop.png") // Your custom stop icon
              : require("../../../assets/mic.png") // Your custom mic icon
          }
          style={styles.iconImage}
        />

        {/* {recording ? (
          <Video
            source={require("../../../assets/listen.mp4")}
            resizeMode="cover"
            style={styles.animation}
            shouldPlay
            isLooping
          />
        ) : (
          <Image
            source={require("../../../assets/mic.png")}
            style={styles.iconImage}
          />
        )} */}

        <Text style={styles.textSpacing}>
          {recording ? "Speak now" : "Press to start recording"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpeechTrackingScreen;

const styles = StyleSheet.create({
  animation: {
    width: 500,
    height: 800,
    justifyContent: "center",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    fontFamily: "DM Sans",
  },
  TopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#02006C",
    width: 412,
    paddingBottom: 20,
  },
  TopHeaderText: {
    color: "white",
    fontSize: 18,
  },
  customIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  iconButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
  iconImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  textSpacing: {
    marginTop: 10,
    fontSize: 15,
  },
  mistakeText: {
    color: "red",
    fontWeight: "bold",
  },
  response: {
    padding: 20,
    marginTop: 50,
  },
});
