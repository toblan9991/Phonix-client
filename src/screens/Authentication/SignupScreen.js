// src/screens/Authentication/SignupScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AuthContext from '../../context/AuthContext';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import { MaterialIcons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
    const { signup, googleSignIn } = useContext(AuthContext);
    const { signInWithGoogle, userProfile } = useGoogleAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);


    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const userProfile = await signInWithGoogle();
            console.log("Google Sign-In successful:", userProfile);
            
            if (userProfile) {
                navigation.navigate("OnboardingScreen2");
            }
        } catch (err) {
            console.error('Google Sign-In error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!email || !username || !password || !confirmPassword) {
            setError('Please fill all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length !== 8) {
            setError('Password must be 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await signup({ email, username, password }, navigation);
            if (response) {
                console.log('Signup successful', response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/AppLogo.png')}
                style={styles.image}
            />
            <Text style={styles.header}>Create an account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    placeholder="Enter your Name"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    
                    autoCompleteType="off" 
                    textContentType="none"
                    style={styles.input}
                />

                       <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                        >
                        <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
                      </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCompleteType="off" 
                    textContentType="none" 
                    style={styles.input}
                />
                <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                    >
                        <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
                    </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
            )}

            {/* Divider with "or" text */}
            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
            </View>

            {/* Google Login Button with Custom Icon */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Image
                    source={require('../../../assets/googleLogin.png')}  // Add your Google icon image here
                    style={styles.googleIcon} // Custom styling for the Google icon
                />
                
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
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
        paddingHorizontal: 20,
    },
    header: {
        color: '#313131',
        textAlign: 'center',
        fontFamily: 'DM Sans',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
    },
    image: {
        width: 134,
        height: 112,
        marginBottom: 20,
        alignSelf: 'center',
        borderRadius: 12,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: '#313131',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    signupButton: {
        backgroundColor: '#02006C', 
        borderRadius: 4,
        marginTop: 30,
        padding: 10,
        width: 353,
        height: 35,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    signupButtonText: {
        color: '#FFF',
        fontFamily: 'DM Sans',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 14, 
        letterSpacing: 0.028,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#C4C4C4',
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#757575',
    },
    
    googleIcon: {
        width: 110,  
        height: 35, 
        marginRight: 10,
        marginBottom:10
    },
   
    loginLink: {
        marginTop: 40,
    },
    loginText: {
        fontFamily: "DM Sans",  
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16,
    },
    eyeIcon: {
        marginLeft: 10,
        position: "absolute",
        right: 10,
        top: 30,
    },
});

export default SignupScreen;
