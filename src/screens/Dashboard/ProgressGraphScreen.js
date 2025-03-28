import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

const ProgressGraphScreen = ({ route }) => {
  const { period } = route.params || {}; // Get initial period from route params if passed
  const [selectedPeriod, setSelectedPeriod] = useState(period || "Week");
  const [scores, setScores] = useState({
    fluency: 0,
    coherence: 0,
    vocabulary: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch scores from backend API
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/feedbackScores/getFeedbackScores"
        ); // Replace with actual API endpoint
        setScores(response.data.scores);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
        setScores({
          fluency: 70,
          coherence: 80,
          vocabulary: 75,
        });
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

  // Example data for time spent (in minutes) in each period
  const timeSpentData = {
    Day: 120, // 2 hours
    Week: 540, // 9 hours
    Month: 2400, // 40 hours
  };

  const dayData = {
    labels: ["12 AM", "6 AM", "12 PM", "6 PM", "11:59 PM"],
    datasets: [
      {
        data: [2, 5, 3, 6, 4],
        strokeWidth: 2,
        color: () => "#FFC031",
      },
    ],
  };

  const weekData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [4, 6, 8, 5, 9, 7, 8],
        strokeWidth: 2,
        color: () => "#FFC031",
      },
    ],
  };

  const monthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [35, 40, 45, 30, 60, 50, 55, 40, 70, 65, 75, 80],
        strokeWidth: 2,
        color: () => "#FFC031",
      },
    ],
  };

  const data =
    selectedPeriod === "Day"
      ? dayData
      : selectedPeriod === "Week"
      ? weekData
      : monthData;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(2, 0, 108, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(2, 0, 108, ${opacity})`,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FFC031",
    },
  };

  // Function to format time in hours and minutes
  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hrs ${remainingMinutes} mins`;
  };

  // Display time spent based on the selected period
  const timeSpent = formatTimeSpent(timeSpentData[selectedPeriod]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.userName}>Hi Vatan!</Text>

      {/* Toggle buttons for Day, Week, Month */}
      <View style={styles.toggleContainer}>
        {["Day", "Week", "Month"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.toggleButton,
              selectedPeriod === period && styles.selectedToggleButton,
            ]}
            onPress={() => setSelectedPeriod(period)} // Change the selected period
          >
            <Text
              style={
                selectedPeriod === period
                  ? styles.selectedToggleText
                  : styles.toggleText
              }
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Period Heading */}
      <Text style={styles.periodHeading}>
        {selectedPeriod === "Day"
          ? "<        Day      >"
          : selectedPeriod === "Week"
          ? "<       Week     >"
          : "<       Month        >"}
      </Text>

      {/* Time Spent Display */}
      <Text style={styles.timeSpent}>Total Duration {timeSpent}</Text>

      {/* Line Chart for the selected period */}
      <View style={styles.chartWrapper}>
        <Text style={styles.chartTitle}>Speech Overview</Text>
        <Text style={styles.chartTitle2}>Percentage of score Achieved</Text>
        <LineChart
          data={data}
          width={Dimensions.get("window").width * 0.8}
          height={300}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    paddingTop: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#02006C",
    marginBottom: 10,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#E7E7E7",
    borderRadius: 8,
    padding: 10,
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 32,
    marginHorizontal: 5,
    borderRadius: 4,
    marginLeft: 15,
  },
  selectedToggleButton: {
    backgroundColor: "#FFC031",
  },
  toggleText: {
    fontSize: 16,
    color: "black",
  },
  selectedToggleText: {
    fontSize: 16,
    color: "black",
  },
  periodHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#02006C",
    marginVertical: 5,
  },
  timeSpent: {
    fontSize: 14,
    color: "white",
    marginBottom: 15,
    backgroundColor: "#02006C",
    marginLeft: 20,
    marginRight: 20,
    width: "80%",
    paddingVertical: 10,
    borderRadius: 15,
    textAlign: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#02006C",
    marginBottom: 10,
  },
  chartTitle2: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#02006C",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
    alignSelf: "center",
    borderRadius: 8,
  },
  chartWrapper: {
    backgroundColor: "white",
    marginTop: 20,
    borderRadius: 8,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ProgressGraphScreen;
