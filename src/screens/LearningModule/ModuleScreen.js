import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { getChaptersByModuleId } from '../../services/api';
import AuthContext from '../../context/AuthContext';

export default function ModuleScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { moduleId, token, moduleName, completedChapterIds = [] } = route.params;
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    navigation.setOptions({
        title: moduleName,
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

    const fetchModuleDetails = async () => {
      try {
        const data = await getChaptersByModuleId(moduleId, token);
        console.log("Fetched module data:", data);
        if (data) {
          setModule({ chapters: data });
        } else {
          setError('No data found for this module.');
        }
      } catch (error) {
        console.error(`Error fetching module details for module ${moduleId}:`, error);
        setError(`Error fetching module details for module ${moduleId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId, token, navigation, moduleName]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!module || !module.chapters || module.chapters.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: '#666' }}>No chapters available for this module.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.objectivesCard}>
          <Text style={styles.chapterTitle}>{module.chapters[0].chapterTitle}</Text>
          <Text style={styles.chapterSubtitle}>{module.chapters[0].subtitle || "Master the class of vocabulary"}</Text>
          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Objectives</Text>
          <Text style={styles.sectionText}>{module.chapters[0].objectives || 'Learn techniques to reduce stuttering and improve speech flow'}</Text>

          <Text style={styles.sectionHeader}>Key Points</Text>
          {module.chapters[0].keyPoints && module.chapters[0].keyPoints.length > 0 ? (
            module.chapters[0].keyPoints.map((point, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {point}
              </Text>
            ))
          ) : (
            <>
              <Text style={styles.bulletPoint}>• Breathing exercise</Text>
              <Text style={styles.bulletPoint}>• Pacing techniques</Text>
              <Text style={styles.bulletPoint}>• Linking words smoothly</Text>
            </>
          )}
        </View>

        <Text style={styles.mainSectionTitle}>Video Lessons</Text>

        <View style={styles.lessonColumn}>
          {module.chapters.map((chapter, index) => (
            <View key={chapter.chapterId} style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>{chapter.chapterTitle}</Text>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() =>
                  navigation.navigate('Lesson', {
                    chapterId: chapter.chapterId,
                    moduleId,
                    token,
                    completedChapterIds,
                    videoUrl: chapter.chapterContent,
                    lessonNumber: index + 1,
                    chapterTitle: chapter.chapterTitle,
                  })
                }
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4faff',
  },
  content: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  objectivesCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2A78',
    marginBottom: 4,
  },
  chapterSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
    marginBottom: 4,
  },
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1B1F',
    marginVertical: 16,
    textAlign: 'center',
  },
  lessonColumn: {
    flexDirection: 'column',
  },
  lessonCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 16,
    color: '#333',
  },
  // playButton: {
  //   backgroundColor: '#1E2A78',
  //   width: 110,
  //   height: 35,
  //   paddingVertical: 6,
  //   paddingHorizontal: 16,
  //   borderRadius: 4,
  // },
  // playButtonText: {
  //   color: 'white',
  //   fontSize: 14,
  //   fontWeight: '600',
  // },
  playButton: {
    backgroundColor: '#1E2A78',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
