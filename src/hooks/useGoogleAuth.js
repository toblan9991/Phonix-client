// src/hooks/useGoogleAuth.js
import React, { useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '../config/apiConfig'; 

const useGoogleAuth = () => {
    const navigation = useNavigation(); // This should be inside the hook
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        webClientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    const [userProfile, setUserProfile] = useState(null);

    // Check response and handle Google login
    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            console.log("response",response )
            handleGoogleSignUp(id_token);
        }
    }, [response]);

    const handleGoogleSignUp = async (idToken) => {
        if (!idToken) return;

        console.log("id token: ", idToken);

        try {
            // Send the ID token to your backend for further processing
            const response = await axios.post("http://localhost:8000/api/auth/google", { idToken });

            // Simulate getting user profile data from Google 
            const googleUserData = {
                name: response.data.name,  
                email: response.data.email,  
                picture: response.data.picture,  
                idToken,
            };

            // Store the Google user info in state to display it below the form
            setUserProfile(googleUserData);
            console.log("Google user Data", googleUserData);

            // Store user info in AsyncStorage
            await AsyncStorage.setItem("@user", JSON.stringify(googleUserData));

            console.log("Signed up with Google:", googleUserData);
            navigation.navigate("OnboardingScreen1");
        } catch (error) {
            
        }
    };

    const signInWithGoogle = () => {
        promptAsync(); // Use promptAsync to trigger Google OAuth flow
    };

    return { signInWithGoogle, userProfile, request }; // Return relevant values from the hook
};

export default useGoogleAuth;
