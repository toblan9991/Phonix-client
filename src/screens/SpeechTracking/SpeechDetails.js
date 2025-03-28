import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios"; // For making HTTP requests
import * as FileSystem from "expo-file-system";
import { OPENAI_API_KEY, BACKEND_PORT } from "../../config/apiConfig";

export const SpeechDetailScreen = ({ route, navigation }) => {
  // Retrieve the feedback passed from SpeechTrackingScreen, with a default fallback
  const { feedback = "No feedback available." } = route.params || {};

  const [chatResponse, setChatResponse] = useState("");

  // Get chatbot response using the transcribed text
  const getChatbotResponse = async (feedback) => {
    try {
      if (!feedback) {
        throw new Error("Transcribed text is empty or undefined.");
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", // Or "gpt-4" if available
          messages: [
            {
              role: "system",
              content: `Based on the above feedback text: ${feedback}, give me a detailed analysis of my speech based on Vocabulary, Coherence and Fluency. Also, award me the points in percentage for each category.`,
            },
            {
              role: "user",
              content: feedback,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      setChatResponse(response.data.choices[0].message.content);
      console.log(
        "Chatbot response:",
        response.data.choices[0].message.content
      );
    } catch (error) {
      console.error(
        "Error getting chatbot response:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to get a response from the chatbot.");
    }
  };

  // Call getChatbotResponse when the component mounts
  // useEffect(() => {
  //   getChatbotResponse(feedback);
  // }, [feedback]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Score</Text>
      <Text style={styles.response}>{chatResponse}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "DM Sans",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  response: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});

// export default DetailsScreen;

// Assess my speech for Vocabulary, Coherence and Fluency. Give me some point based feedback. For example: 'user says: My name is Bhawleen. I study at Langara. I am a Full Stack Developer. Chatbot response: Your vocabulary is very good. It is 8/10. Your Coherence was excellent. it is 9/10. Your Fluency was also to the point. it is at 8/10. Overall, your level is Advanced.'. Elaborate the feedback concisely yet informatively. Also, put the words or phrases in ** which need correction.

//   export default DetailsScreen;
