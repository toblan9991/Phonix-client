
// import React from "react";
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   TouchableOpacity
// } from "react-native";
// import { StyleSheet } from 'react-native';
//  // Use standard React Native

// import { useNavigation } from "@react-navigation/native";

// const FirstScreen = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../../../assets/FirstScreenImage.png')} // replace with your image path
//         style={styles.image}
//       />
//       <Text style={styles.title}>Phonix</Text>
//       <Text style={{margin:30, textAlign: 'center'}}>Ready to transform your speech? Start your journey now!</Text>
//       <View style={styles.buttonContainer}>
//         {/* <Button
//           title="Sign Up"
//           onPress={() => navigation.navigate("Signup")}
//           color="#4B79A1" // Color for the Sign Up button
//         /> */}
//         <TouchableOpacity 
//         style={styles.signupButton}
//         onPress={() => navigation.navigate('Signup')}
        
//       >
//         <Text style={styles.buttonText}>Signup</Text>
//       </TouchableOpacity>
//         {/* <Button
//           title="Log In"
//           onPress={() => navigation.navigate("Login")}
//           color="#28A745" // Color for the Log In button
//         /> */}
//         <TouchableOpacity 
//         style={styles.signupButton}
//         onPress={() => navigation.navigate('Login')}
        
//       >
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "F4FAFF",
//   },
//   image: {
//     width: 300,
//     height: 200,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "black", // Primary color
//   },
//   buttonContainer: {
//     width: "80%",
//     marginTop: 20,
//   },
//   signupButton: {
//     backgroundColor: '#02006C', 
//     borderRadius: "10%",
//     marginTop: 30,
//     padding: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: "center"
//   },
// });

// export default FirstScreen;



//working
import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity
} from "react-native";
import { StyleSheet } from 'react-native';
 // Use standard React Native

import { useNavigation } from "@react-navigation/native";

const FirstScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/FirstScreenImage.png')} // replace with your image path
        style={styles.image}
      />
      <Text style={styles.title}>Phonix</Text>
      <Text style={{
        color: '#404040', 
        textAlign: 'center', 
        fontFamily: 'DM Sans', 
        fontSize: 16, 
        fontStyle: 'normal', 
        fontWeight: '400', 
        width: 353,
        letterSpacing: 0.2, 

      }}>Ready to transform your speech? Start your journey now!</Text>
      <View style={styles.buttonContainer}>
        {/* <Button
          title="Sign Up"
          onPress={() => navigation.navigate("Signup")}
          color="#4B79A1" // Color for the Sign Up button
        /> */}
        <TouchableOpacity 
        style={styles.signupButton}
        onPress={() => navigation.navigate('Signup')}
        
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
        {/* <Button
          title="Log In"
          onPress={() => navigation.navigate("Login")}
          color="#28A745" // Color for the Log In button
        /> */}
        <TouchableOpacity 
        style={styles.signupButton}
        onPress={() => navigation.navigate('Login')}
        
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    paddingTop: 10,
    fontFamily: 'DM Sans',
   
  },
  image: {
    width: 276,
    height: 295,
    marginBottom: 20,
    objectFit: "cover",
    marginTop: 0,
    flexShrink: 0,
   // backgroundColor: "red",
  },
  title: {
    color: "#000",
    textAlign: "center",
     fontSize: "28px",
     fontStyle: "normal",
     fontWeight: "700",
     fontFamily: "DM Sans",
     lineHeight: "normal",
     margin: 20,

    
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: '#02006C', 
    borderRadius: 4,
    marginTop: 30,
    padding: 10,
    width: 300,
    height: 35,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#FFF',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14, 
    letterSpacing: 0.028,
  },
});

export default FirstScreen;

