import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Text, Button, ActivityIndicator, Platform, Alert, TouchableOpacity } from 'react-native';
import { getModuleDetails, completeChapter } from '../../services/api';
import { WebView } from 'react-native-webview';
import AuthContext from '../../context/AuthContext';
import RNFS from 'react-native-fs';

export default function LessonScreen({ route, navigation }) {
  console.log('LessonScreen component is rendering...');
  const { user } = useContext(AuthContext);
  const { chapterId, moduleId, moduleName, token, chapterTitle, lessonNumber, completedChapterIds = [] } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
        title: `Lesson ${lessonNumber}`,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#02006C',
        },
        headerTitleStyle: {
          color: '#FFC031',
          fontSize: 18,
          fontWeight: 'bold',
        },
      });

    const fetchLesson = async () => {
      try {
        console.log('Fetching lesson details for chapterId:', chapterId);
        const data = await getModuleDetails(chapterId, token);
        if (data) {
          console.log('Lesson data received:', data);
          setLesson(data);
        } else {
          console.error('No data found for the lesson');
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
        console.log('Finished fetching lesson details');
      }
    };

    fetchLesson();
  }, [chapterId, token, navigation, lessonNumber]);

  useEffect(() => {
    if (Platform.OS === 'ios' && lesson) {
      const filePath = `${RNFS.MainBundlePath}/video-player.html`;
      RNFS.exists(filePath).then((exists) => {
        if (!exists) {
          console.warn(`File does NOT exist at path: ${filePath}`);
          Alert.alert('File Error', 'The HTML file could not be found in the app bundle.');
        }
      });
    }
  }, [lesson]);

  const handleWebViewMessage = (event) => {
    const messageData = JSON.parse(event.nativeEvent.data);
    if (messageData.percentage) {
      const progress = Math.round(messageData.percentage);
      setWatchedPercentage(progress);

      if (progress >= 90) {
        setCanComplete(true);
      }
    }
  };

  const handleCompleteLesson = async () => {
    console.log('Attempting to complete lesson...');
    if (canComplete) {
      try {
        console.log('Completing lesson for chapterId:', chapterId);
        const result = await completeChapter(moduleId, chapterId, token);
        if (result) {
          console.log('Chapter completed successfully:', chapterId);
          const updatedCompletedChapters = [...completedChapterIds, chapterId];
          navigation.navigate('Module', {
            moduleId,
            token,
            title: moduleName,
            completedChapterIds: updatedCompletedChapters,
          });
        } else {
          throw new Error('Failed to complete the chapter');
        }
      } catch (error) {
        console.error(`Error completing chapter ${chapterId}:`, error);
      }
    } else {
      console.log('Lesson cannot be completed yet. Watched percentage:', watchedPercentage);
    }
  };

  if (loading) {
    console.log('Lesson is still loading...');
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!lesson) {
    console.warn('No lesson data is available.');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Lesson data could not be loaded.</Text>
      </View>
    );
  }

  const videoUrl = lesson.chapterContent;
  const videoId = videoUrl.split('v=')[1]?.split('&')[0];

  const localHtmlUri = Platform.OS === 'ios'
    ? { uri: `file://${RNFS.MainBundlePath}/video-player.html?videoId=${videoId}` }
    : { uri: `file:///android_asset/video-player.html?videoId=${videoId}` };

  return (
    <View style={styles.container}>
      <View style={styles.videoPlayerContainer}>
      {videoId ? (
        <WebView
          style={styles.video}
          ref={webViewRef}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          source={localHtmlUri}
          onMessage={handleWebViewMessage}
        />
      ) : (
        <Text style={styles.progressText}>Loading video...</Text>
      )}
       </View>
       <View style={styles.video1}></View>
      <TouchableOpacity onPress={handleCompleteLesson} disabled={!canComplete}  style={[styles.saveButton, !canComplete && styles.disabledButton]}>
        <Text style={styles.saveButtonText}>Complete Lesson</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4faff',
  },
  video1: {
    backgroundColor: '#f4faff',
    width: 100,
    height: 245,
  },
  lessonContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  videoPlayerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f4faff',
  },
  video: {
    width: 550,
    height: 300,
    marginTop: 150,
    marginLeft: 20,
    backgroundColor: '#f4faff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  saveButton: {
    width: '90%',
    margin: 20,
    backgroundColor: '#02006C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
