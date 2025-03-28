
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const OnboardingScreen3 = ({ navigation, route }) => {
  const { feedback } = route.params || {}; // Access the feedback passed from the previous screen
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect3, setIsCorrect3] = useState(false); // Renamed to isCorrect3

  // Sample data for the synonym question
  const word = "Alleviate";
  const options = ["Intensify", "Mitigate", "Aggravate", "Exacerbate"];
  const correctAnswer = "Mitigate";

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsCorrect3(option === correctAnswer); // Set isCorrect3
  };

  return (
    <View style={styles.container}>
       <Image
                source={require('../../../assets/ProgressBar2.png')}
                style={styles.image1}
            />
      <Text style={styles.title}>Choose the synonym for the word provided</Text>
     
      
      <View style={styles.optionsContainer}>
      <Text style={styles.word}>{word}</Text>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === option && {
                backgroundColor: selectedOption === correctAnswer ? '#02006C' : '#E63946',
              },
            ]}
            onPress={() => handleOptionSelect(option)}
          >
             <Text
        style={[
          styles.optionText,
          selectedOption === option && {
            color: '#FFC031', // Change text color to white when selected
          },
        ]}
      >
        {option} {/* Display the option text here */}
      </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        // onPress={() => 
        //   navigation.navigate('OnboardingScreen4', { feedback, isCorrect3 }) // Pass the renamed state
        // } 
        onPress={() => {
            if (!selectedOption) {
              alert("Please select an option before proceeding!");
            } else {
              navigation.navigate('OnboardingScreen4', { feedback, isCorrect3 });
            }
          }}
          
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      
      {/* Optional feedback display */}
      {/* {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Feedback:</Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#F4FAFF',
        paddingTop: 10,
        paddingHorizontal: 20,
        fontFamily: 'DM Sans',
  },
  title: {
    color: '#000',           
    fontFamily: 'DM Sans',    
    fontSize: 20,            
    fontWeight: '500',       
    lineHeight: 20, 
    textAlign: "left"  
  },
  word: {
        paddingTop: 30,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'DM Sans',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 20
  },
  optionsContainer: {
    marginTop: 30,
    marginBottom: 30,
    width: 353,
    height: 325,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  option: {
    backgroundColor: 'white',
    borderRadius: 4,
    width: 310,
    height: 40,
    marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: 'center',
    paddingLeft:20,
    marginLeft:20,
    marginRight: 20,
    
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#02006C', 
    borderRadius: 4,
    marginTop: 30,
    padding: 10,
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 150
    position: 'absolute',
    bottom: 60,
    left: 20
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0F7FA',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  image1: {
    width: 300,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
    objectFit: "contain"
  }
});

export default OnboardingScreen3;
