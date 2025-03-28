// src/screens/Onboarding/OnboardingScreen5.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import { OPENAI_API_KEY } from "../../config/apiConfig";
import AuthContext from "../../context/AuthContext";

const OnboardingScreen5 = ({ route, navigation }) => {
  const { completeOnboarding } = useContext(AuthContext);

  const { feedback = "No feedback available.", isCorrect3, isCorrect4 } = route.params || {};

  const handleCompleteOnboarding = async () => {
    await completeOnboarding();
    navigation.replace("DashboardScreen");
  };

  const answersArray = [
    {
      screen: "OnboardingScreen2",
      userChoice: feedback !== "No feedback available." ? feedback : "Incorrect",
    },
    {
      screen: "OnboardingScreen3",
      userChoice: isCorrect3 ? "Mitigate" : "Incorrect",
      correctChoice: "Mitigate",
    },
    {
      screen: "OnboardingScreen4",
      userChoice: isCorrect4 ? "Scarce" : "Incorrect",
      correctChoice: "Scarce",
    },
  ];

  const [aiFeedback, setAiFeedback] = useState(null);
  const [userLevel, setUserLevel] = useState(null);

  const sendAnswersToAI = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an evaluator assessing a user's responses based on vocabulary, coherence, and fluency. Provide one-line feedback on their level (Beginner, Intermediate, Advanced).`,
            },
            {
              role: "user",
              content: `Analyze the following answers:\n
              ${answersArray
                .map(
                  (answer) =>
                    `Screen: ${answer.screen}, User's Choice: ${answer.userChoice}, Correct Answer: ${answer.correctChoice}`
                )
                .join("\n")}.
              
              Based on the responses, evaluate the user’s level and give constructive feedback.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const level = aiResponse.toLowerCase().includes("beginner")
        ? "Beginner"
        : aiResponse.toLowerCase().includes("intermediate")
        ? "Intermediate"
        : aiResponse.toLowerCase().includes("advanced")
        ? "Advanced"
        : "Beginner";

      setUserLevel(level);
      setAiFeedback(aiResponse);
    } catch (error) {
      console.error("Error in sending answers to AI:", error);
      Alert.alert("Error", "Failed to communicate with AI.");
    }
  };

  useEffect(() => {
    sendAnswersToAI();
  }, []);

   const [shakeAnimation] = useState(new Animated.Value(0));
   const [fadeAnimation] = useState(new Animated.Value(0));

  // useEffect(() => {
  //   if (userLevel === "Advanced") {
  //     Animated.sequence([
  //       Animated.timing(fadeAnimation, {
  //         toValue: 1,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }),
  //       Animated.loop(
  //         Animated.sequence([
  //           Animated.timing(shakeAnimation, {
  //             toValue: 1,
  //             duration: 100,
  //             easing: Easing.linear,
  //             useNativeDriver: true,
  //           }),
  //           Animated.timing(shakeAnimation, {
  //             toValue: -1,
  //             duration: 100,
  //             easing: Easing.linear,
  //             useNativeDriver: true,
  //           }),
  //           Animated.timing(shakeAnimation, {
  //             toValue: 0,
  //             duration: 100,
  //             easing: Easing.linear,
  //             useNativeDriver: true,
  //           }),
  //         ]),
  //         { iterations: 3 }
  //       ),
  //     ]).start();
  //   }
  // }, [userLevel]);

  const getLevelImage = (level) => {
    switch (level) {
      case "Beginner":
        return require("../../../assets/beginner.png");
      case "Intermediate":
        return require("../../../assets/Intermediate.png");
      case "Advanced":
        return require("../../../assets/Advanced1.png");
      default:
        return require("../../../assets/beginner.png");
    }
  };

  // const renderAdvancedImage = () => (
  //   <View style={styles.advancedImageContainer}>
  //     <Animated.Image
  //       source={require("../../../assets/Advanced1.png")}
  //       style={[
  //         styles.advancedImage,
  //         {
  //           transform: [
  //             {
  //               translateX: shakeAnimation.interpolate({
  //                 inputRange: [-1, 1],
  //                 outputRange: [-20, 20],
  //               }),
  //             },
  //             {
  //               rotate: shakeAnimation.interpolate({
  //                 inputRange: [-1, 1],
  //                 outputRange: ["-16deg", "15deg"], // Adjust rotation angle
  //               }),
  //             },
  //           ],
  //           opacity: fadeAnimation,
  //         },
  //       ]}
  //     />
  //     <Image
  //       source={require("../../../assets/Intermediate.png")}
  //       style={styles.intermediateOverlay}
  //     />
  //   </View>
  // );



  const [scaleAnimation] = useState(new Animated.Value(1)); // Initialize scale animation

useEffect(() => {
  if (userLevel === "Advanced") {
    // Combine shake, fade, and scale animations
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnimation, {
              toValue: 1,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: -1,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: 0,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.1, // Scale up
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1, // Scale down
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }
}, [userLevel]);

const renderAdvancedImage = () => (
  <View style={styles.advancedImageContainer}>
    <Animated.Image
      source={require("../../../assets/Advanced1.png")}
      style={[
        styles.advancedImage,
        {
          transform: [
            {
              scale: scaleAnimation, // Add scale transformation
            },
            {
              translateX: shakeAnimation.interpolate({
                inputRange: [-1, 1],
                outputRange: [-20, 20],
              }),
            },
            {
              rotate: shakeAnimation.interpolate({
                inputRange: [-1, 1],
                outputRange: ["-16deg", "15deg"], // Adjust rotation angle
              }),
            },
          ],
          opacity: fadeAnimation,
        },
      ]}
    />
    <Image
      source={require("../../../assets/Intermediate.png")}
      style={styles.intermediateOverlay}
    />
  </View>
);

  
  return (
    <View style={styles.container}>
      {userLevel === "Advanced" ? (
        renderAdvancedImage()
      ) : (
        <Image source={getLevelImage(userLevel)} style={styles.image} />
      )}

      <Text style={styles.title}>
        {userLevel === "Beginner"
          ? "Great Start!"
          : userLevel === "Intermediate"
          ? "Awesome!"
          : userLevel === "Advanced"
          ? "Fantastic Work!"
          : "Great Start!"}
      </Text>

      {aiFeedback ? (
        <Text style={styles.feedbackText}>{aiFeedback}</Text>
      ) : (
        <Text style={styles.feedbackText}>Evaluating your responses...</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCompleteOnboarding(userLevel)}
      >
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    paddingTop: 10,
    paddingHorizontal: 20,
    fontFamily: 'DM Sans',
  },
  advancedImageContainer: {
    position: "absolute",
    top: 0,
    width: 300,
    height: 300,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  advancedImage: {
    width: 300,
    height: 300,
    position: "absolute",
    top: 0,
  },
  intermediateOverlay: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 170,
  },

  
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  feedbackText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#02006C",
    borderRadius: 4,
    marginTop: 30,
    padding: 10,
    width: "100%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 60,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen5;
