
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const colors = ["#02006C", "#4D4C98", "#FFC031"]; // Match your design

const CircularProgress = ({ data }) => {
  const size = 150; // Diameter of the circle
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const isDataAvailable = data.some((value) => value > 0);
  let offset = 0;

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Svg height={size} width={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {isDataAvailable ? (
            data.map((value, index) => {
              const strokeDashoffset = circumference * (1 - value / 100);

              const circle = (
                <Circle
                  key={index}
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke={colors[index]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={offset}
                  fill="none"
                />
              );

              offset += circumference * (value / 100); // Adjust offset
              return circle;
            })
          ) : (
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
              fill="none"
            />
          )}
        </G>
      </Svg>
      {!isDataAvailable && (
        <Text style={{ color: "#A0A0A0", marginTop: 10, fontSize: 16 }}>
          No Data Available
        </Text>
      )}
    </View>
  );
};

const ProgressDetailsScreen = () => {
  const [originalScores, setOriginalScores] = useState({
    fluency: 0,
    coherence: 0,
    vocabulary: 0,
  });
  const [adjustedScores, setAdjustedScores] = useState({
    fluency: 0,
    coherence: 0,
    vocabulary: 0,
  });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Function to adjust scores to sum to 100%
  const adjustScores = (scores) => {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return scores.map((score) => Math.round((score / total) * 100));
  };

  // Date formatting function
  const formatDate = () => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  useEffect(() => {
    // Fetch scores from backend API
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/feedbackScores/getFeedbackScores"
        ); // Adjust to match your API endpoint

        const fetchedScores = response.data.scores;

        // Original scores
        const originalScoresArray = [
          fetchedScores[0]?.fluencyScore || 0,
          fetchedScores[0]?.coherenceScore || 0,
          fetchedScores[0]?.vocabularyScore || 0,
        ];

        // Adjust scores to sum to 100%
        const adjustedScoresArray = adjustScores(originalScoresArray);

        // Update states
        setOriginalScores({
          fluency: originalScoresArray[0],
          coherence: originalScoresArray[1],
          vocabulary: originalScoresArray[2],
        });

        setAdjustedScores({
          fluency: adjustedScoresArray[0],
          coherence: adjustedScoresArray[1],
          vocabulary: adjustedScoresArray[2],
        });
      } catch (error) {
        console.error("Failed to fetch scores:", error.message);
        setOriginalScores({ fluency: 0, coherence: 0, vocabulary: 0 }); // Fallback
        setAdjustedScores({ fluency: 0, coherence: 0, vocabulary: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Convert adjusted scores to array format for CircularProgress
  const progressData = [
    adjustedScores.fluency,
    adjustedScores.coherence,
    adjustedScores.vocabulary,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Progress Overview</Text>

        {/* Date Navigation */}
        <View style={styles.dateContainer}>
  {/* Display the selected date */}
  <Text style={styles.dateText}>
    {formatDate()} {/* Ensure this returns a string */}
  </Text>

  {/* Touchable Calendar Icon */}
  <TouchableOpacity onPress={() => setShowPicker(true)}>
    <Image
      source={require('../../../assets/Calender.png')} // Update the path to your custom calendar icon
      style={styles.iconImage}  // Style for the calendar icon image
    />
  </TouchableOpacity>

  {/* Date Picker */}
  {showPicker && (
    <DateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={onDateChange}
    />
  )}
</View>

      <View style={styles.overviewContainer}>
        <Text style={styles.title}>Detailed Analysis</Text>

        {/* Circular progress chart */}
        <CircularProgress data={progressData} />

        {/* Scores with colorful dots */}
        {["Fluency", "Coherence", "Vocabulary"].map((label, index) => (
          <View key={index} style={styles.scoreRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors[index] },
              ]}
            />
            <Text style={styles.scoreText}>
              {label}: {originalScores[label.toLowerCase()]}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4FAFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 25,
    marginTop: 20,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 16,
    color: "#333",
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  iconImage: {
    width: 20, 
    height: 20, 
    marginLeft: 5,
  },
});

export default ProgressDetailsScreen;
