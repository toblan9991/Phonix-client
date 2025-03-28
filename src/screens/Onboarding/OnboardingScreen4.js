
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const OnboardingScreen4 = ({ navigation, route }) => {
  const { feedback, isCorrect3 } = route.params || {}; // Access feedback and previous correctness
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect4, setIsCorrect4] = useState(false); // Renamed to isCorrect4

  // Sample data for the antonym question
  const word = "Abundant";
  const options = ["Scarce", "Plentiful", "Ample", "Generous"];
  const correctAnswer = "Scarce";

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsCorrect4(option === correctAnswer); // Set isCorrect4
  };

  return (
    <View style={styles.container}>
       <Image
                source={require('../../../assets/ProgressBar3.png')}
                style={styles.image1}
            />

      <Text style={styles.title}>Choose the opposite of the word provided</Text>
     
      
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
            {/* <Text style={styles.optionText}>{option}</Text> */}
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
        //   navigation.navigate('OnboardingScreen5', { feedback, isCorrect4, previousIsCorrect }) // Pass isCorrect4 and previousIsCorrect
        // } 
        onPress={() => {
            if (!selectedOption) {
              alert("Please select an option before proceeding!");
            } else {
              navigation.navigate('OnboardingScreen5', { feedback, isCorrect3, isCorrect4 });
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

export default OnboardingScreen4;

