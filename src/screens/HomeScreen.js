// // import React from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Image,
// //   ScrollView,
// //   TouchableOpacity,
// // } from "react-native";
// // import { useRoute } from "@react-navigation/native";
// // import * as Progress from "react-native-progress";

// // const HomeScreen = () => {
// //   const route = useRoute();
// //   const userLevel = route.params?.userLevel || "Beginner";
// //   const score = 0; // Example score, replace this with actual score value

// //   const [selectedPeriod, setSelectedPeriod] = React.useState("Day"); // Moved inside the component

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       {/* Profile Section */}
// //       <View style={styles.profileContainer}>
// //         <Text style={styles.greeting}>Hi Vatan!</Text>
// //         <Image
// //           style={styles.profileImage}
// //           source={require("../../assets/user.png")}
// //         />
// //         <Text style={styles.name}>Vatan</Text>
// //         <Text style={styles.level}>Intermediate</Text>
// //       </View>

// //       {/* Statistics Section */}
// //       <View style={styles.statsContainer}>
// //         <Image
// //           style={styles.statImage}
// //           source={require("../../assets/avgScore.png")}
// //         />
// //         <View style={styles.statCard}>
// //           <Text style={styles.statText}>Avg. Score</Text>
// //           <Text style={styles.statValue}>0%</Text>
// //         </View>
// //         <Image
// //           style={styles.statImage}
// //           source={require("../../assets/totalSpeech.png")}
// //         />
// //         <View style={styles.statCard}>
// //           <Text style={styles.statText}>Total Speech</Text>
// //           <Text style={styles.statValue}>0</Text>
// //         </View>
// //       </View>

// //       {/* Toggle Button Section */}
// //       <View style={styles.toggleContainer}>
// //         {["Day", "Week", "Month"].map((period) => (
// //           <TouchableOpacity
// //             key={period}
// //             style={[
// //               styles.toggleButton,
// //               selectedPeriod === period && styles.selectedToggleButton,
// //             ]}
// //             onPress={() => setSelectedPeriod(period)}
// //           >
// //             <Text
// //               style={
// //                 selectedPeriod === period
// //                   ? styles.selectedToggleText
// //                   : styles.toggleText
// //               }
// //             >
// //               {period}
// //             </Text>
// //           </TouchableOpacity>
// //         ))}
// //       </View>

// //       {/* Date Navigation */}
// //       <View style={styles.dateContainer}>
// //         <Text style={styles.dateText}>Today, September 26</Text>
// //       </View>

// //       {/* Speech Overview */}
// //       <View style={styles.overviewContainer}>
// //         <Text style={styles.overviewTitle}>Speech Overview</Text>
// //         {/* Align items in row */}
// //         <View style={styles.overviewContent}>
// //           {/* Left side: Total Speech and Duration */}
// //           <View style={styles.leftContent}>
// //             <Text style={styles.totalSpeech}>Total Speech</Text>
// //             <Text style={styles.totalSpeech}>0</Text>
// //             <Text style={styles.totalDuration}>Total Duration</Text>
// //             <Text style={styles.totalSpeech}>0</Text>
// //           </View>

// //           {/* Right side: Score and Progress Circle */}
// //           <View style={styles.rightContent}>
// //             <Text style={styles.overviewScore}>Your score is {score}</Text>
// //             <Progress.Circle
// //               size={120}
// //               progress={score / 100}
// //               showsText={true}
// //               formatText={() => `${score}%`}
// //               color="#02006C"
// //               unfilledColor="#D9D9D9"
// //               thickness={18}
// //               borderWidth={0}
// //               style={styles.progressCircle}
// //             />
// //           </View>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     paddingTop: 10,
// //     backgroundColor: "#F9F9FB",
// //     flex: 1,
// //   },
// //   profileContainer: {
// //     alignItems: "center",
// //     marginTop: 0,
// //     padding: 0,
// //   },
// //   greeting: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "#02006C",
// //     alignSelf: "flex-start",
// //   },
// //   profileImage: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     marginVertical: 10,
// //   },
// //   name: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     color: "#02006C",
// //   },
// //   level: {
// //     fontSize: 16,
// //     color: "gray",
// //   },
// //   statsContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     marginVertical: 20,
// //     backgroundColor: "#02006C",
// //     paddingVertical: 15,
// //     borderRadius: 10,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   statCard: {
// //     alignItems: "center",
// //   },
// //   statImage: {
// //     width: 45,
// //     height: 45,
// //     marginBottom: 5,
// //   },
// //   statText: {
// //     fontSize: 16,
// //     color: "white",
// //   },
// //   statValue: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "white",
// //   },
// //   dateContainer: {
// //     alignItems: "center",
// //     marginVertical: 3,
// //   },
// //   dateText: {
// //     fontSize: 18,
// //     color: "#02006C",
// //   },
// //   overviewContainer: {
// //     // backgroundColor: '#fff',
// //     backgroundColor: "#E7E7E7",
// //     padding: 20,
// //     paddingTop: 5,
// //     borderRadius: 8,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     marginVertical: 20,
// //     alignItems: "center",
// //   },
// //   overviewTitle: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     color: "#02006C",
// //     textAlign: "center",
// //   },
// //   overviewContent: {
// //     flexDirection: "row",
// //     width: "100%",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginTop: 10,
// //   },
// //   leftContent: {
// //     alignItems: "flex-start",
// //   },
// //   rightContent: {
// //     alignItems: "flex-end",
// //   },
// //   overviewScore: {
// //     fontSize: 16,
// //     color: "#02006C",
// //     marginVertical: 10,
// //   },
// //   progressCircle: {
// //     marginVertical: 5,
// //   },
// //   totalSpeech: {
// //     fontSize: 16,
// //     color: "gray",
// //     alignSelf: "left",
// //     marginBottom: 15,
// //   },
// //   totalDuration: {
// //     fontSize: 16,
// //     color: "gray",
// //   },
// //   toggleContainer: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     marginVertical: 10,
// //     backgroundColor: "#E7E7E7",
// //     borderRadius: 8,
// //     padding: 10,
// //   },
// //   toggleButton: {
// //     paddingVertical: 10,
// //     paddingHorizontal: 30,
// //     marginHorizontal: 5,
// //     borderWidth: 1,
// //     borderColor: "#02006C",
// //     borderRadius: 8,
// //   },
// //   selectedToggleButton: {
// //     backgroundColor: "#FFC031",
// //   },
// //   toggleText: {
// //     fontSize: 16,
// //     color: "#02006C",
// //   },
// //   selectedToggleText: {
// //     fontSize: 16,
// //     color: "black",
// //     fontWeight: "bold",
// //   },
// // });

// // export default HomeScreen;




// // // ProgressGraphScreen.js
// // import React, { useEffect, useState } from 'react';
// // import { View, Text, StyleSheet, Dimensions } from 'react-native';
// // import axios from 'axios';
// // import { Svg, Circle, G } from 'react-native-svg';

// // const CircularProgress = ({ data }) => {
// //   const size = 150; // Diameter of the circle
// //   const strokeWidth = 20;
// //   const radius = (size - strokeWidth) / 2;
// //   const circumference = 2 * Math.PI * radius;
  
// //   // Colors for each section
// //   const colors = ['#FF6347', '#32CD32', '#1E90FF']; // Adjusted to match your original colors
  
// //   // Calculate strokeDashoffset for each data segment
// //   let offset = 0;
  
// //   return (
// //     <View style={{ alignItems: 'center', marginVertical: 20 }}>
// //       <Svg height={size} width={size}>
// //         <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
// //           {data.map((value, index) => {
// //             const strokeDashoffset = circumference * (1 - value / 100);
// //             const circleElement = (
// //               <Circle
// //                 key={index}
// //                 cx="50%"
// //                 cy="50%"
// //                 r={radius}
// //                 stroke={colors[index]}
// //                 strokeWidth={strokeWidth}
// //                 strokeDasharray={`${circumference} ${circumference}`}
// //                 strokeDashoffset={offset}
// //                 fill="none"
// //               />
// //             );
// //             offset += strokeDashoffset;
// //             return circleElement;
// //           })}
// //         </G>
// //       </Svg>
// //     </View>
// //   );
// // };

// // const ProgressGraphScreen = () => {
// //   const [scores, setScores] = useState({ fluency: 0, coherence: 0, vocabulary: 0 });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Fetch scores from backend API
// //     const fetchScores = async () => {
// //       try {
// //         const response = await axios.post('http://localhost:8000/api/feedback/chatbotResponse'); // Adjust to match your API endpoint
// //         setScores(response.data.scores); // Adjust based on API response structure
// //       } catch (error) {
// //         console.error("Failed to fetch scores:", error);
// //         // Fallback to dummy data if the API request fails
// //         setScores({
// //           fluency: 70, // Dummy fluency score
// //           coherence: 80, // Dummy coherence score
// //           vocabulary: 75, // Dummy vocabulary score
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchScores();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <Text>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   // Convert scores to array format expected by CircularProgress
// //   const progressData = [scores.fluency, scores.coherence, scores.vocabulary];

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.header}>Progress Overview</Text>

// //       {/* Circular progress chart */}
// //       <CircularProgress data={progressData} />

// //       <Text>Fluency: {scores.fluency}%</Text>
// //       <Text>Coherence: {scores.coherence}%</Text>
// //       <Text>Vocabulary: {scores.vocabulary}%</Text>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#F5F5F5',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   header: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //   },
// // });

// // export default ProgressGraphScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import axios from 'axios';
// import { LineChart } from 'react-native-chart-kit';

// const ProgressGraphScreen = ({ route }) => {
//   const { period } = route.params; // Get the selected period (Day, Week, or Month)
//   const [scores, setScores] = useState({ fluency: 0, coherence: 0, vocabulary: 0 });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch scores from backend API
//     const fetchScores = async () => {
//       try {
//         const response = await axios.post('http://localhost:8000/api/feedback/chatbotResponse'); // Adjust to match your API endpoint
//         setScores(response.data.scores); // Adjust based on API response structure
//       } catch (error) {
//         console.error("Failed to fetch scores:", error);
//         setScores({
//           fluency: 70, // Dummy fluency score
//           coherence: 80, // Dummy coherence score
//           vocabulary: 75, // Dummy vocabulary score
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScores();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // Example data for time spent (in minutes) for different periods
//   const timeSpentData = {
//     Day: 120, // 2 hours
//     Week: 540, // 9 hours
//     Month: 2400, // 40 hours
//   };

//   // Example chart data for Day, Week, and Month
//   const dayData = {
//     labels: ["12 AM", "6 AM", "12 PM", "6 PM", "11:59 PM"],
//     datasets: [
//       {
//         data: [2, 5, 3, 6, 4],
//         strokeWidth: 2,
//         color: () => '#FFC031',
//       },
//     ],
//   };

//   const weekData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         data: [4, 6, 8, 5, 9, 7, 8],
//         strokeWidth: 2,
//         color: () => '#FFC031',
//       },
//     ],
//   };

//   const monthData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     datasets: [
//       {
//         data: [35, 40, 45, 30, 60, 50, 55, 40, 70, 65, 75, 80],
//         strokeWidth: 2,
//         color: () => '#FFC031',
//       },
//     ],
//   };

//   // Select the appropriate chart data based on the period
//   const chartData =
//     period === "Day" ? dayData : period === "Week" ? weekData : monthData;

//   // Format time spent
//   const formatTimeSpent = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;
//     return `${hours} hrs ${remainingMinutes} mins`;
//   };

//   const timeSpent = formatTimeSpent(timeSpentData[period]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Progress Overview</Text>

//       <Text style={styles.periodHeading}>{period}</Text>

//       {/* Time Spent Display */}
//       <Text style={styles.timeSpent}>Total Duration {timeSpent}</Text>

//       {/* Line Chart */}
//       <Text style={styles.chartTitle}>Speech Overview</Text>
//       <Text style={styles.chartTitle2}>Percentage of Score Achieved</Text>
//       <LineChart
//         data={chartData}
//         width={Dimensions.get("window").width * 0.8}
//         height={300}
//         chartConfig={{
//           backgroundColor: '#ffffff',
//           backgroundGradientFrom: '#ffffff',
//           backgroundGradientTo: '#ffffff',
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(2, 0, 108, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(2, 0, 108, ${opacity})`,
//           propsForDots: {
//             r: "6",
//             strokeWidth: "2",
//             stroke: "#FFC031",
//           },
//         }}
//         bezier
//         style={styles.chart}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   periodHeading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   timeSpent: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   chartTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   chartTitle2: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   chart: {
//     marginTop: 20,
//     borderRadius: 10,
//   },
// });

// export default ProgressGraphScreen;

