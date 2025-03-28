import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AuthContext from '../../context/AuthContext'; 
import { MaterialIcons } from '@expo/vector-icons';
import useGoogleAuth from '../../hooks/useGoogleAuth';

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const { signInWithGoogle, userProfile } = useGoogleAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(username, password);
            if (rememberMe) {
                // Save credentials logic here (e.g., AsyncStorage or SecureStore)
            }
            navigation.navigate('OnboardingScreen1');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userProfile) {
            navigation.navigate("OnboardingScreen2");
        }
    }, [userProfile]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const userProfile = await signInWithGoogle();
            if (userProfile) {
                navigation.navigate("OnboardingScreen1");
            }
        } catch (err) {
            console.error('Google Sign-In error:', err);
            setError(err.message);
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
            <Text style={styles.header}>Welcome back</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View>
                    <TextInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                    >
                        <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Remember Me Checkbox */}
            <View style={styles.rememberMeWrapper}>
            <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            )}

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Image
                    source={require('../../../assets/googleLogin.png')}
                    style={styles.googleIcon}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
                <Text style={styles.signupText}>Don’t have an account? Sign up</Text>
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
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    eyeIcon: {
        marginLeft: 10,
        position: "absolute",
        right: 10,
        top: 10,
    },
    rememberMeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        backgroundColor: 'white',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#02006C',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#313131',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginLeft: 120
    },
    forgotPasswordText: {
        color: '#02006C',
        fontSize: 12,
    },
    loginButton: {
        backgroundColor: '#02006C',
        borderRadius: 4,
        marginTop: 30,
        padding: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '400',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#C4C4C4',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#1F1F1F',
        fontSize: 14,
    },
    googleButton: {
        width: 110,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupLink: {
        marginTop: 110,
    },
    signupText: {
        color: '#1F1F1F',
        textAlign: 'center',
        fontSize: 14,
    },
    image: {
        width: 134,
        height: 112,
        marginBottom: 20,
        alignSelf: 'center',
        borderRadius: 12,
    },
});

export default LoginScreen;

