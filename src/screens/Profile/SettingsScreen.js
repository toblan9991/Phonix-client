import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import ellipseM from '../../../assets/ellipseM.png';
import ellipseF1 from '../../../assets/ellipseF1.png';

const SettingsScreen = () => {
    const { user, logout, setUser } = useContext(AuthContext);

    const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const level = user?.level || '';


  const handleImagePick = async () => {
    console.log('Edit profile picture icon clicked');
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        console.error(`ImagePicker Error [${result.errorCode}]: ${result.errorMessage}`);
        Alert.alert('Error', 'Failed to pick an image. Please try again.');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfilePicture(selectedImage.uri);

        // Optionally, handle base64 image data if needed
        console.log('Base64 data:', selectedImage.base64);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);

      if (profilePicture) {
        formData.append('profilePicture', {
          uri: profilePicture,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }
// https://pho-nix.ca/Phonix-backend/api/ 
      // const response = await axios.put('https://d405-72-143-227-226.ngrok-free.app/api/auth/user', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });

      const response = await axios.put(`http://localhost:8000/api/auth/user/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      // const response = await axios.put(`https://pho-nix.ca/Phonix-backend/api/auth/user/${user.id}`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // });

      if (setUser) {
        setUser({ ...user, ...response.data.user });
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        console.error('setUser is not defined');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileContainer}>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageWrapper}>
        <Image
          source={
            profilePicture
              ? { uri: profilePicture }
              : ellipseF1
          }
          style={styles.profileImage}
        />
        {/* <Ionicons
            name="pencil"
            size={20}
            color="white"
            style={styles.editImageIcon}
          /> */}
      </TouchableOpacity>
      <Text style={styles.username}>{user?.username || 'Us ername not found'}</Text>
        {/* <Text style={styles.userEmail}>{user?.email || 'Email not found'}</Text> */}
        <Text style={styles.userLevel}>{level}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F4FAFF',
      fontFamily: 'DM Sans',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 20,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    imageWrapper: {
      position: 'relative',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    editImageIcon: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: '#02006C',
      borderRadius: 10,
      padding: 5,
    },
    infoSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: '#313131',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#02006C',
      borderRadius: 8,
      padding: 10,
      backgroundColor: '#fff',
      fontSize: 16,
      color: '#000',
    },
    saveButton: {
      marginTop: 20,
      backgroundColor: '#02006C',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
    logoutButton: {
      marginTop: 30,
      backgroundColor: '#FFF',
      borderColor: '#4E4D98',
      borderWidth: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: '#02006C',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default SettingsScreen;







