import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const renderSpeechWithMistakes = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/); // Split the text at '**...**' marks

  return parts.map((part, index) => {
    // Check if the part is a mistake (wrapped in '**')
    if (part.startsWith("**") && part.endsWith("**")) {
      const correctedWord = part.slice(2, -2); // Remove the surrounding '**'
      return (
        <Text key={index} style={styles.mistakeText}>
          {correctedWord.toUpperCase()} {/* Capitalize the mistakes */}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
};

const FeedbackScreen = ({ route, navigation }) => {
  const { chatResponse, latestRecording } = route.params; // Get chatResponse and latestRecording from params

  const [recording, setRecording] = useState(false);

  // Start recording function
  const startRecording = () => {
    setRecording(true);
    // Code to start recording here
  };

  // Stop recording function
  const stopRecording = () => {
    setRecording(false);
    // Code to stop recording here
  };

  // Function to handle "Hear your voice" button click
  const handleHearMyVoice = () => {
    if (
      latestRecording &&
      latestRecording.sound &&
      latestRecording.sound.replayAsync
    ) {
      latestRecording.sound.replayAsync(); // Replay the sound if available
    } else {
      Alert.alert(
        "No recording saved",
        "You don't have a recording saved yet."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Display Chatbot Response with mistakes highlighted */}
      <ScrollView contentContainerStyle={styles.response}>
        {chatResponse ? renderSpeechWithMistakes(chatResponse) : null}
      </ScrollView>

      {/* Bottom container with aligned buttons */}
      <View style={styles.bottomContainer}>
        {/* Always show Hear your voice button */}
        <TouchableOpacity
          onPress={handleHearMyVoice}
          style={styles.buttonWrapper}
        >
          <Image
            source={require("../../../assets/hear.png")}
            style={styles.smallIconImage}
          />
          <Text style={styles.textSpacing}>Hear your voice</Text>
        </TouchableOpacity>

        {/* Microphone button (only show if there's a chatbot response) */}
        {chatResponse ? (
          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            // onPress={() => navigation.navigate("speak")}
            style={styles.iconButton}
          >
            <Image
              source={
                recording
                  ? require("../../../assets/stop.png") // Stop icon when recording
                  : require("../../../assets/mic.png") // Microphone icon when not recording
              }
              style={styles.mediumIconImage}
            />
            <Text style={styles.textSpacing2}>Microphone</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonWrapper} /> // Empty space if chatResponse is not available
        )}

        {/* Go to Details button */}
        {chatResponse && (
          <TouchableOpacity
            onPress={
              () => navigation.navigate("Score", { feedback: chatResponse }) // Navigate to Score screen
            }
            style={styles.buttonWrapper}
          >
            <Image
              source={require("../../../assets/next.png")}
              style={styles.smallIconImage}
            />
            <Text style={styles.textSpacing}>next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensures bottom container stays at the bottom
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F4FAFF",
    fontFamily: "DM Sans",
  },
  response: {
    padding: 20,
    marginTop: 50,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mistakeText: {
    color: "red", // Highlight mistakes in red
    fontWeight: "bold", // Optionally bold the mistakes
    textTransform: "uppercase", // Capitalize the mistakes
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20, // Adds padding for spacing at the bottom
    width: "100%",
    position: "absolute", // Fixes it to the bottom of the screen
    bottom: 0, // Ensures it's at the bottom of the screen
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  smallIconImage: {
    width: 40,
    height: 40,
    alignSelf: "center",
  },
  mediumIconImage: {
    width: 70,
    height: 70,
    marginLeft: -30,
    alignSelf: "center",
  },
  textSpacing: {
    marginTop: 10,
    fontSize: 14,
  },
  textSpacing2: {
    marginTop: 10,
    fontSize: 14,
    marginRight: 25,
  },
  iconButton: {
    alignItems: "center",
    marginHorizontal: 10,
  },
});

export default FeedbackScreen;
