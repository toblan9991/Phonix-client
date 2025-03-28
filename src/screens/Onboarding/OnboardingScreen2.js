import React, { useState } from "react";
import { View, Button, Text, Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import axios from "axios"; 
import * as FileSystem from "expo-file-system";
import { OPENAI_API_KEY } from "../../config/apiConfig";

const OnboardingScreen2 = ({ navigation, route }) => {
    const { selectedLevel } = route.params || {}; // Retrieve selected level
    const [recording, setRecording] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [transcription, setTranscription] = useState("");
    const [chatResponse, setChatResponse] = useState("");

    const getMicrophonePermission = async () => {
        const { granted } = await Audio.requestPermissionsAsync();
        return granted;
    };

    const startRecording = async () => {
        try {
            const permission = await getMicrophonePermission();
            if (!permission) {
                alert("Please grant permission to access the microphone.");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );

            setRecording(recording);
            console.log("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    };

    const stopRecording = async () => {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);

        const { sound } = await recording.createNewLoadedSoundAsync();
        setRecordings([...recordings, { sound, uri }]);

        uploadAudioToWhisper(uri);
    };

    const uploadAudioToWhisper = async (fileUri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                throw new Error("File doesn't exist");
            }

            const formData = new FormData();
            formData.append("file", {
                uri: fileUri,
                name: "recording.m4a",
                type: "audio/m4a",
            });
            formData.append("model", "whisper-1");
            formData.append("response_format", "text");

            const response = await axios.post(
                "https://api.openai.com/v1/audio/transcriptions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );

            console.log("API response:", response.data);
            getChatbotResponse(response.data);
        } catch (error) {
            console.error(
                "Error transcribing audio:",
                error.response?.data || error.message
            );
            Alert.alert("Error", "Failed to transcribe the audio.");
        }
    };

    const getChatbotResponse = async (transcribedText) => {
        try {
            if (!transcribedText) {
                throw new Error("Transcribed text is empty or undefined.");
            }

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Assess my speech for Vocabulary, Coherence and Fluency. Give me some point based feedback. For example: 'user says: My name is Bhawleen. I study at Langara. I am a Full Stack Developer. Chatbot response: You have successfully completed the assessment and achieved the --- level'. Fill this dash according to your assessment tell whether it is beginner intermediate or advanced level. Give me the feedback in just one line. Keep the assessment parameters very high.",
                        },
                        {
                            role: "user",
                            content: transcribedText,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );

            const chatbotFeedback = response.data.choices[0].message.content;
            
            if (chatbotFeedback) {
                // Store feedback in state
                setChatResponse(chatbotFeedback);
                // Navigate to the next screen and pass both selected level and feedback
                navigation.navigate("OnboardingScreen3", { feedback: chatbotFeedback, selectedLevel});
            } else {
                console.error("Chatbot feedback is undefined");
            }
        } catch (error) {
            console.error(
                "Error getting chatbot response:",
                error.response?.data || error.message
            );
            Alert.alert("Error", "Failed to get a response from the chatbot.");
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/ProgressBar1.png')}
                style={styles.image1}
            />
            <Text style={styles.title}>Read the sentence aloud</Text>
            <Text style={styles.text}>
            It was a calm morning in the small town, with the streets quiet and the shops just opening. John walked through the park, enjoying the cool air and the sound of birds chirping in the trees. The dew on the grass sparkled in the sunlight, and everything felt still. As he headed to the café for his morning coffee, he reflected on the simple joys of life—the peaceful walk, the warm drink, and the start of a new day full of opportunities.
            </Text>

            <Image
                source={require('../../../assets/microphone.png')}
                style={styles.image2}
            />
            <Button
                title={recording ? "Press to Stop Recording" : "Press to Start Recording"}
                onPress={recording ? stopRecording : startRecording}
                style={styles.recording}  
            />

            {/* Touchable microphone image button
            <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                <Image source={require('../../../assets/microphone.png')} style={styles.image2} />
            </TouchableOpacity> */}



            <TouchableOpacity 
                style={styles.button2}
                onPress={() => navigation.navigate('OnboardingScreen3', { selectedLevel: selectedLevel })}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            {chatResponse ? (
                <View>
                    <Text>Feedback</Text>
                    <Text>{chatResponse}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        fontFamily: 'DM Sans',
        backgroundColor: '#F4FAFF',
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    title: {
        color: '#000',           // Text color
        fontFamily: 'DM Sans',    // Custom font family
        fontSize: 20,             // Font size
        fontWeight: '500',        // Font weight
        lineHeight: 20, 
        textAlign: "left"  
    },
    text: {
        color: '#000',           // Text color
        fontFamily: 'DM Sans',    // Custom font family
        fontSize: 16,             // Font size
        fontWeight: '400',        // Font weight
        lineHeight: 20, 
        textAlign: "left",
        letterSpacing: 0.5
    },
    image1: {
        width: 300,
        height: 50,
        alignSelf: 'center',
        marginBottom: 20,
        objectFit: "contain",
        paddingTop: 5,
    },
    image2: {
        marginTop: 150,
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 20,
        objectFit: "cover",
        backgroundColor: '#02006C',
    
        borderRadius: "100%",
    },
    button2: {
        backgroundColor: '#02006C', 
        borderRadius: 4,
        marginTop: 30,
        padding: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
        left: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    recording: {
       color: "black"
    },
});

export default OnboardingScreen2;

