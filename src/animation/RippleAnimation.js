import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

export const RippleAnimation = () => {
  const navigation = useNavigation();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const sound = useRef(new Audio.Sound());

  const texts = ["Improve Vocabulary", "Improve Coherence", "Improve Fluency"];

  const rippleAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const playSound = async () => {
    try {
      await sound.current.loadAsync(
        require("../../assets/fairy-tale-loop.mp3")
      );
      await sound.current.setIsLoopingAsync(true);
      await sound.current.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const startRippleSequence = () => {
    rippleAnimations.forEach((anim) => anim.setValue(0));

    const rippleSequence = rippleAnimations.map((anim, index) => {
      return Animated.sequence([
        Animated.delay(index * 500),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(rippleSequence).start(() => {
      startRippleSequence();
    });
  };

  useEffect(() => {
    // playSound();

    startRippleSequence();

    const textChangeInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      });
    }, 2000);

    const navigationTimer = setTimeout(() => {
      sound.current.stopAsync();
      sound.current.unloadAsync();
      navigation.replace("FirstScreen");
    }, 8000);

    return () => {
      clearInterval(textChangeInterval);
      clearTimeout(navigationTimer);
      sound.current.stopAsync();
      sound.current.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      {rippleAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.ripple,
            {
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 4],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0.4, 0.2, 0],
              }),
            },
          ]}
        />
      ))}

      <View style={styles.staticCircle}>
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
          {texts[currentTextIndex]}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02006C",
  },
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  staticCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  text: {
    color: "#123B79",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
