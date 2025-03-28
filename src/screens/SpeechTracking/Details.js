import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
// import Video from "react-native-video";
import { Video } from "expo-av";
import { StatusBar } from "react-native";
import axios from "axios";
import { OPENAI_API_KEY, BACKEND_PORT } from "../../config/apiConfig";

// Function to send chatbot response to the backend
const sendToBackend = async (chatResponse, navigation) => {
  try {
    const response = await axios.post(
      `${BACKEND_PORT}/api/feedback/chatbotResponse`,
      {
        chatbotResponse: chatResponse,
      }
    );

    console.log("Data sent to backend:", response.data);
    // Alert.alert("Success", "Feedback saved successfully.");
    // Navigate back to Home screen
    navigation.navigate("Home");
  } catch (error) {
    console.error("Error sending data to backend:", error.message);
  }
};

const sendScores = async (vocabularyScore, coherenceScore, fluencyScore) => {
  try {
    const response = await axios.post(`${BACKEND_PORT}/api/scores`, {
      vocabularyScore,
      coherenceScore,
      fluencyScore,
    });

    console.log("Data sent to backend:", response.data);
    navigation.navigate("Home");
  } catch (error) {
    console.error("Error sending data to backend:", error.message);
  }
};

export const DetailsScreen = ({ route, navigation }) => {
  const { feedback = "No feedback available." } = route.params || {};
  const [scores, setScores] = useState({
    fluency: 75,
    vocabulary: 80,
    coherence: 75,
  });

  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chatbot response and extract scores and feedback
  const getChatbotResponse = async (feedback) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4", // Ensure model availability
          messages: [
            {
              role: "system",

              content: `Based on the above feedback text: ${feedback}, give me a detailed analysis of my speech based on Vocabulary, Coherence and Fluency. Also, award me the points in percentage for each category. The points should be named Points and clearly specified under each category for example:- "Below is the detailed analysis of your feature:-........ The overall scores for each section is as follows:- Vocabulary: 80% Fluency: 85% Coherence: 80%." You should strictly stick to the pattern mentioned above while giving the feedback.`,
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

      const chatbotResponse = response.data.choices[0].message.content;

      const vocabRegex = /Vocabulary.*?\*?\*?(\d+)%/i;
      const coherenceRegex = /Coherence.*?\*?\*?(\d+)%/i;
      const fluencyRegex = /Fluency.*?\*?\*?(\d+)%/i;

      const fluency = parseInt(
        chatbotResponse.match(fluencyRegex)?.[1] || 0,
        10
      );
      const vocabulary = parseInt(
        chatbotResponse.match(vocabRegex)?.[1] || 0,
        10
      );
      const coherence = parseInt(
        chatbotResponse.match(coherenceRegex)?.[1] || 0,
        10
      );

      // Mock data - Replace with actual parsing of `chatbotResponse` to extract scores
      // const fluency = 85; // Extract from chatbotResponse
      // const vocabulary = 90; // Extract from chatbotResponse
      // const coherence = 88; // Extract from chatbotResponse

      setScores({ fluency, vocabulary, coherence });
      setFeedbackText(chatbotResponse);
    } catch (error) {
      console.error("Error fetching chatbot response:", error.message);
      Alert.alert("Error", "Failed to get a response from the chatbot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatbotResponse(feedback);
  }, [feedback]);

  const handleSavePress = () => {
    Alert.alert("Save Feedback", "Do you want to save this feedback?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          sendToBackend(feedbackText, navigation);
          // navigation.navigate("speak");
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar
        barStyle="light-content" // Set status bar text color to white
        //backgroundColor="#02006C" // Optional: Change background color
      />
      <View style={styles.container}>
        {loading ? (
          // <ActivityIndicator size="large" color="#007BFF" />

          <Video
            source={require("../../../assets/Processing_animation.mp4")}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="fill"
            isLooping
            shouldPlay
          />
        ) : (
          <ScrollView>
            {/* Score Section */}
            <View style={styles.scoreContainer}>
              {/* Fluency */}
              <View style={[styles.scoreLabel, styles.topLeft]}>
                <Image
                  source={require("../../../assets/fluency.png")}
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>Fluency</Text>
                <Text style={styles.score}>{scores.fluency || "--"}%</Text>
              </View>

              {/* Vocabulary */}
              <View style={[styles.scoreLabel, styles.topRight]}>
                <Image
                  source={require("../../../assets/vocabulary.png")}
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>Vocabulary</Text>
                <Text style={styles.score}>{scores.vocabulary || "--"}%</Text>
              </View>

              {/* Star in Center */}
              <Image
                source={require("../../../assets/star.png")}
                style={styles.star}
              />

              {/* Coherence */}
              <View style={[styles.scoreLabel, styles.bottomCenter]}>
                <Image
                  source={require("../../../assets/coherence.png")}
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>Coherence</Text>
                <Text style={styles.score}>{scores.coherence || "--"}%</Text>
              </View>
            </View>

            {/* Feedback Section */}
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Detailed Feedback</Text>
              <Text style={styles.feedbackText}>{feedbackText}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSavePress}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FAFF",
    padding: 16,
    fontFamily: "DM Sans",
    color: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  scoreContainer: {
    position: "relative",
    height: 350,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  scoreLabel: {
    position: "absolute",
    alignItems: "center",
  },
  topLeft: {
    top: 40,
    left: 40,
  },
  topRight: {
    top: 40,
    right: 40,
  },
  bottomCenter: {
    bottom: 20,
  },
  star: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  score: {
    fontSize: 18,
    color: "black",
  },
  feedbackContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F4FAFF",
    borderRadius: 8,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: "black",
    fontFamily: "DM Sans",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  saveButton: {
    backgroundColor: "#02006C",
    borderRadius: 4,
    marginTop: 30,
    padding: 10,
    width: "100%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // loaderContainer: {
  //   flex: 1, // Ensure it takes up the full screen
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#F4FAFF", // Replace with your desired color
  // },
});

export default DetailsScreen;
