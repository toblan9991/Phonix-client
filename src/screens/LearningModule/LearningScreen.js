import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { getLearningModules } from '../../services/api';
import AuthContext from '../../context/AuthContext';

export default function LearningScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    navigation.setOptions({
        title: 'Learning Modules',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#02006C',
          height: 60,
        },
        headerTitleStyle: {
          color: '#ffc031',
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerBackVisible: true,
      });

    const fetchModules = async () => {
      try {
        if (!token) {
          throw new Error('No token provided');
        }
        const data = await getLearningModules(token);
        if (data) {
          setModules(data);
          setFilteredModules(data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        console.error('Error fetching module:', err.message || err);
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [token]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter((module) => module.moduleName === filter);
      setFilteredModules(filtered);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!modules.length) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noModulesText}>No learning modules available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#f4faff" />
    <ScrollView style={styles.container}>
      {/* <Text style={styles.heading}>Learning Modules</Text> */}
      <Text style={styles.subheading}>Improve your speech skills</Text>
      <View style={styles.filtersContainer}>
        {['All', 'Fluency', 'Vocabulary', 'Coherence'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter && styles.activeFilterButtonText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredModules.map((module) => (
        <View key={module.moduleId} style={styles.moduleWrapper}>
          <Text style={styles.moduleTitle}>{module.moduleName}</Text>
          <View style={styles.moduleContainer}>
            <Text style={styles.moduleSubtitle}>
              {module.moduleName === 'Fluency' ? 'Pronunciation Drills' :
               module.moduleName === 'Vocabulary' ? 'Advanced Synonyms' :
               module.moduleName === 'Coherence' ? 'Logical Transition' : ''}
            </Text>
            <Text style={styles.moduleDescription}>
              {module.moduleName === 'Fluency' ? 'Practice different sounds and words' :
               module.moduleName === 'Vocabulary' ? 'Expand your vocabulary with synonyms' :
               module.moduleName === 'Coherence' ? 'Improve the flow of your speech' : ''}
            </Text>
            <View style={styles.footerContainer}>
              <Text style={styles.lessonsText}>{module.chapters.length} lessons</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() =>
                  navigation.navigate('Module', { moduleId: module.moduleId, token, moduleName: module.moduleName })
                }
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4faff',
      },
    container: {
      flex: 1,
      backgroundColor: '#f4faff',
      padding: 16,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E2A78',
      marginBottom: 8,
    },
    subheading: {
      fontSize: 16,
      color: '#5A5A5A',
      marginBottom: 16,
    },
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    filterButton: {
      padding: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#1E2A78',
    },
    filterButtonText: {
      fontSize: 14,
      color: '#1E2A78',
    },
    activeFilterButton: {
      backgroundColor: '#1E2A78',
    },
    activeFilterButtonText: {
      color: '#ffc031',
    },
    moduleWrapper: {
      marginBottom: 24,
    },
    moduleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    moduleContainer: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 3,
    },
    moduleSubtitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 4,
    },
    moduleDescription: {
      fontSize: 14,
      color: '#777',
      marginBottom: 16,
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lessonsText: {
      fontSize: 14,
      color: '#777',
    },
    startButton: {
      backgroundColor: '#1E2A78',
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    startButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: '#D32F2F',
      fontSize: 16,
    },
    noModulesText: {
      color: '#888',
      fontSize: 16,
    },
  });
