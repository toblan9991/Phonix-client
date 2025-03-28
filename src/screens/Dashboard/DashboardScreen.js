import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useContext } from "@react-navigation/native";
import * as Progress from "react-native-progress";
//import { AuthContext } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const DashboardScreen = () => {
  const navigation = useNavigation();
  //const { username } = useContext(AuthContext);
  const [toggleIcon, setToggleIcon] = useState(false);

  const route = useRoute();

  const userLevel = route.params?.userLevel || "";

  const score = 0; // Example score, replace this with actual score value

  const [selectedPeriod, setSelectedPeriod] = useState("Day");
  const [date, setDate] = useState(new Date()); // Initialize date to today
  const [showPicker, setShowPicker] = useState(false);

  const [scores, setScores] = useState({
    vocabulary: 0,
    coherence: 0,
    fluency: 0,
  });
  const [totalSpeech, setTotalSpeech] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Loading...");

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false); // Hide the picker after a date is selected
    if (selectedDate) setDate(selectedDate); // Update the date if a new one is selected
  };

  const formatDate = () => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleIconToggle = () => {
    setToggleIcon((prev) => !prev); // Toggle the icon state
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period); // Update selected period

    navigation.navigate("ProgressGraphScreen", { period }); // Navigate to ProgressGraphScreen with the selected period
  };

  // const totalSpeech = () => {};

  // const avgScore = () => {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get(
          "http://localhost:8000/api/feedbackScores/getFeedbackScores"
        );

        const { userName, scores } = response.data;
        setUserName(userName);
        setUserLevel(userLevel);
        setScores(scores);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true); // Set loading state
  //       setError(null); // Reset error

  //       // Replace with your backend API endpoint
  //       const scoresResponse = await axios.get(
  //         "http://localhost:8000/api/feedbackScores/getFeedbackScores"
  //       );
  //       const speechesResponse = await axios.get(
  //         "http://localhost:8000/api/totalSpeech/totalSpeech"
  //       );

  //       // Process fetched data
  //       const fetchedScores = scoresResponse.data.scores;
  //       const totalSpeeches = speechesResponse.data.scores.length;

  //       // Calculate averages
  //       const totalVocabulary = fetchedScores.reduce(
  //         (acc, s) => acc + s.vocabularyScore,
  //         0
  //       );
  //       const totalCoherence = fetchedScores.reduce(
  //         (acc, s) => acc + s.coherenceScore,
  //         0
  //       );
  //       const totalFluency = fetchedScores.reduce(
  //         (acc, s) => acc + s.fluencyScore,
  //         0
  //       );
  //       const totalEntries = fetchedScores.length || 1;

  //       const avg =
  //         (totalVocabulary + totalCoherence + totalFluency) /
  //         (3 * totalEntries);

  //       // Update states
  //       setScores({
  //         vocabulary: fetchedScores[0]?.vocabularyScore || 0,
  //         coherence: fetchedScores[0]?.coherenceScore || 0,
  //         fluency: fetchedScores[0]?.fluencyScore || 0,
  //       });
  //       setTotalSpeech(totalSpeeches);
  //       setAvgScore(avg.toFixed(2)); // Format to 2 decimal places

  //       setLoading(false); // Stop loading state
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //       setError("Failed to fetch data");
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // Set loading state
          setError(null); // Reset error

          // Replace with your backend API endpoint
          const scoresResponse = await axios.get(
            "http://localhost:8000/api/feedbackScores/getFeedbackScores"
          );
          const speechesResponse = await axios.get(
            "http://localhost:8000/api/totalSpeech/totalSpeech"
          );

          // Process fetched data
          const fetchedScores = scoresResponse.data.scores;
          const totalSpeeches = speechesResponse.data.scores.length;

          // Calculate averages
          const totalVocabulary = fetchedScores.reduce(
            (acc, s) => acc + s.vocabularyScore,
            0
          );
          const totalCoherence = fetchedScores.reduce(
            (acc, s) => acc + s.coherenceScore,
            0
          );
          const totalFluency = fetchedScores.reduce(
            (acc, s) => acc + s.fluencyScore,
            0
          );
          const totalEntries = fetchedScores.length || 1;

          const avg =
            (totalVocabulary + totalCoherence + totalFluency) /
            (3 * totalEntries);

          // Update states
          setScores({
            vocabulary: fetchedScores[0]?.vocabularyScore || 0,
            coherence: fetchedScores[0]?.coherenceScore || 0,
            fluency: fetchedScores[0]?.fluencyScore || 0,
          });
          setTotalSpeech(totalSpeeches);
          setAvgScore(avg.toFixed(2)); // Format to 2 decimal places

          setLoading(false); // Stop loading state
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data");
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Text style={styles.greeting}>Hi {userName}</Text>
        <Image
          style={styles.profileImage}
          source={require("../../../assets/ellipseF1.png")}
        />

        <Text style={styles.name}>{userName}</Text>

        <Text style={styles.level}>{userLevel}</Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <Image
          style={styles.statImage}
          source={require("../../../assets/avgScore.png")}
        />
        <View style={styles.statCard}>
          <Text style={styles.statText}>Avg. Score</Text>

          <Text style={styles.statValue}>
            {loading ? "..." : `${avgScore}%`}
          </Text>
        </View>
        <Image
          style={styles.statImage}
          source={require("../../../assets/totalSpeech.png")}
        />
        <View style={styles.statCard}>
          <Text style={styles.statText}>Total Speech</Text>

          <Text style={styles.statValue}>{loading ? "..." : totalSpeech}</Text>
        </View>
      </View>

      {/* Toggle Button Section */}
      {/* <View style={styles.toggleContainer}>
        {["Day", "Week", "Month"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.toggleButton,
              selectedPeriod === period && styles.selectedToggleButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
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
      </View> */}

      <View style={styles.toggleContainer}>
        {["Day", "Week", "Month"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.toggleButton,
              selectedPeriod === period && styles.selectedToggleButton,
            ]}
            onPress={() => handlePeriodSelect(period)} // Navigate to ProgressGraphScreen
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



      {/* Toggle between Speech and Overview Containers */}
      <View style={styles.overviewContainer}>
        <View style={styles.titleToggleStyle}>
          <Text style={styles.overviewTitle}>
            {toggleIcon ? "Speech Container" : "Overview Container"}
          </Text>
          <TouchableOpacity onPress={handleIconToggle}>
            <Icon
              name={toggleIcon ? "toggle-on" : "toggle-off"}
              size={24}
              color="#02006C"
              style={styles.overviewToggleIcon}
            />
          </TouchableOpacity>
        </View>

        {toggleIcon ? (
          // Speech Container content
          <View style={styles.overviewSpeechContent}>
            <View style={styles.rowContainer}>
              <Text style={styles.totalSpeech}>Speech 1</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProgressDetailsScreen");
                }}
              >
                <Text style={styles.linkText}>View Progress</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.totalSpeech}>Speech 2</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProgressDetailsScreen");
                }}
              >
                <Text style={styles.linkText}>View Progress</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.totalSpeech}>Speech 3</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProgressDetailsScreen");
                }}
              >
                <Text style={styles.linkText}>View Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Overview Container content
          <View style={styles.overviewContent}>
            <View style={styles.leftContent}>
              <Text style={styles.totalSpeech}>Total Speech</Text>

              <Text style={styles.totalSpeech}>
                {loading ? "..." : totalSpeech}
              </Text>
              {/* <Text style={styles.totalDuration}>Total Duration</Text>
              <Text style={styles.totalSpeech}>0</Text> */}
            </View>

            <View style={styles.rightContent}>
              <Text style={styles.overviewScore}>Your score is {avgScore}</Text>
              <Progress.Circle
                size={120}
                progress={avgScore / 100}
                showsText={true}
                formatText={() => `${avgScore}%`}
                color="#02006C"
                unfilledColor="#D9D9D9"
                thickness={18}
                borderWidth={0}
                style={styles.progressCircle}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#F9F9FB",
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 0,
    padding: 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#02006C",
    alignSelf: "flex-start",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#02006C",
  },
  level: {
    fontSize: 16,
    color: "gray",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    backgroundColor: "#02006C",
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    alignItems: "center",
  },
  statImage: {
    width: 45,
    height: 45,
    marginBottom: 5,
  },
  statText: {
    fontSize: 16,
    color: "white",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
    width: 20, // Adjust width to your preference
    height: 20, // Adjust height to your preference
    marginLeft: 5,
  },
  overviewContainer: {
    // backgroundColor: '#fff',
    backgroundColor: "#E7E7E7",
    padding: 20,
    paddingTop: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
    // flexDirection: "row",
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#02006C",
    textAlign: "center",
  },
  overviewContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  overviewSpeechContent: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  titleToggleStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  overviewToggleIcon: {
    margin: 10,
    color: "#02006C",
    alignSelf: "right",
  },

  leftContent: {
    alignItems: "flex-start",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  overviewScore: {
    fontSize: 16,
    color: "#02006C",
    marginVertical: 10,
  },
  progressCircle: {
    marginVertical: 5,
  },
  totalSpeech: {
    fontSize: 16,
    color: "gray",
    alignSelf: "left",
    marginBottom: 15,
  },
  totalDuration: {
    fontSize: 16,
    color: "gray",
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 16,

    color: "#02006C",
    textDecorationLine: "underline",
  },
});

export default DashboardScreen;

