
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { RadioButton, Button } from 'react-native-paper';

// const OnboardingScreen1 = ({ navigation }) => {
//   const [level, setLevel] = useState(''); // Track selected level

//   return (
//     <View style={styles.container}>
//       {/* Top Title */}
//       <Text style={styles.title}>Choose Practice Level</Text>

//       {/* Illustration */}
//       <Image
//         source={require('../../../assets/PracticeLevel.png')}
//         style={styles.image}
//       />

//       {/* Radio buttons for selecting levels */}
//       <View style={styles.radioGroup}>
//         <RadioButton.Group onValueChange={(newValue) => setLevel(newValue)} value={level}>
//           <RadioButton.Item
//             label="Beginner"
//             value="beginner"
//             color={level === 'beginner' ? 'orange' : undefined}
//             style={styles.radioButtonItem}
//           />
//           <RadioButton.Item
//             label="Intermediate"
//             value="intermediate"
//             color={level === 'intermediate' ? 'orange' : undefined}
//             style={styles.radioButtonItem}
//           />
//           <RadioButton.Item
//             label="Advanced"
//             value="advanced"
//             color={level === 'advanced' ? 'orange' : undefined}
//             style={styles.radioButtonItem}
//           />
//         </RadioButton.Group>
//       </View>

//       {/* Conditionally render buttons based on level selection */}
//       {level ? (
//         <Button
//           mode="contained"
//           onPress={() => navigation.navigate('OnboardingScreen2', { selectedLevel: level })}
//           style={styles.blueButton}
//           labelStyle={styles.buttonText}
//         >
//           Confirm Level
//         </Button>
//       ) : (
//         <Button
//           mode="contained"
//           onPress={() => navigation.navigate('OnboardingScreen2', { selectedLevel: 'beginner' })}
//           style={styles.blueButton}
//           labelStyle={styles.buttonText}
//         >
//           Skip to Quiz
//         </Button>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#F4FAFF',
//     paddingTop: 10,
//     paddingHorizontal: 20,
//   },
//   title: {
//     color: '#000',
//     textAlign: 'center',
//     fontFamily: 'DM Sans',
//     fontSize: 28,
//     fontWeight: '700',
//     lineHeight: 34,
//   },
//   image: {
//     width: 215,
//     height: 315,
//     marginBottom: 20,
//     resizeMode: 'cover',
//   },
//   radioGroup: {
//     marginVertical: 20,
//   },
//   radioButtonItem: {
//     backgroundColor: 'white',
//     borderRadius: 4,
//     width: 353,
//     height: 40,
//     marginBottom: 10,
//   },
//   blueButton: {
//     backgroundColor: '#02006C', // Blue background color
//     marginTop: 60,
//     width: 353,
//     height: 35,
//     borderRadius: 4,
//   },
//   buttonText: {
//     color: 'white',
    
//   },
// });

// export default OnboardingScreen1;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const OnboardingScreen1 = ({ navigation }) => {
  const [level, setLevel] = useState(''); // Tracks the selected level

  const levels = ['Beginner', 'Intermediate', 'Advanced']; // Practice levels

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Choose Practice Level</Text>

      {/* Illustration */}
      <Image
        source={require('../../../assets/PracticeLevel.png')}
        style={styles.image}
      />

      {/* Radio buttons */}
      <View style={styles.radioGroup}>
        {levels.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.radioButton,
              level === item && styles.radioButtonSelected, // Apply selected styles
            ]}
            onPress={() => setLevel(item)} // Update selected level
          >
            <Text
              style={[
                styles.radioLabel,
                level === item && styles.radioLabelSelected, // Apply selected label styles
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      {level ? (
        <TouchableOpacity
          style={styles.blueButton}
          onPress={() => navigation.navigate('OnboardingScreen2', { selectedLevel: level })}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.blueButton}
          onPress={() => navigation.navigate('OnboardingScreen2', { selectedLevel: 'Beginner' })}
        >
          <Text style={styles.buttonText}>Skip to Quiz</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F4FAFF',
    paddingTop: 10,
    paddingHorizontal: 20,
    fontFamily: 'DM Sans',
  },
  title: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  image: {
    width: 215,
    height: 315,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  radioGroup: {
    marginVertical: 20,
    width: '100%',
  },
  radioButton: {

    borderRadius: 4,
    backgroundColor: '#FFF',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'start',
    paddingLeft: 15,
    marginBottom: 10,

  },
  radioButtonSelected: {
    backgroundColor: '#02006C', // Dark blue for selected
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000', // Default text color
  },
  radioLabelSelected: {
    color: '#FFC301', // Golden text for selected
  },
  blueButton: {
    backgroundColor: '#02006C', // Dark blue
    marginTop: 60,
    width: 353,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen1;
