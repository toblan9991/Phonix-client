import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../context/AuthContext';
import ellipseM from '../../../assets/ellipseM.png';
import ellipseF1 from '../../../assets/ellipseF1.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';



const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const level = user?.level || '';
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const savedPoints = await AsyncStorage.getItem('userPoints');
        if (savedPoints) {
          setPoints(JSON.parse(savedPoints));
        }
      } catch (error) {
        console.error('Error loading points:', error);
      }
    };
    loadPoints();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPoints();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSettingsPress = () => {
    const username = user?.username || 'Amandeep Kaur'; 
    const email = user?.email || 'example@example.com'; 
    const level = user?.level || 'Beginner'; 

    navigation.navigate('Settings', {
      username,
      email,
      level,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4faff" />
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity style={styles.settingsIcon} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileContainer}>
      <Image
        source={
          user?.profilePicture
            ? { uri: user.profilePicture }
            : ellipseF1
        }
        style={styles.profileImage}
      />
        <Text style={styles.username}>{user?.username || 'Username not found'}</Text>
        <Text style={styles.userLevel}>{level}</Text>
      </View>

      <View style={styles.scoreContainer}>
      <View style={styles.badgesHeader}>
      <Text style={styles.badgesTitle}>Overview</Text>
      </View>
        <View style={styles.scoreBox}>
          <Ionicons name="star" size={24} color="yellow" />
          <View>
            <Text style={styles.totalScoreText}>Total Score</Text>
            {/* <Text style={styles.scorePoints}>120 Points</Text> */}
            <Text style={styles.scorePoints}>{points} Points</Text>
          </View>
        </View>
      </View>

       {/* Badges Section */}
       <View style={styles.badgesSection}>
        <View style={styles.badgesHeader}>
          <Text style={styles.badgesTitle}>Badges</Text>
          {/* <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.badgesGrid}>
        {['Champion', 'Pro Champ', 'Master', 'Expert', 'Guru', 'Legend'].map((badgeName, index) => (
      <View key={index} style={styles.badgeContainer}>
        <Image
          source={require('../../../assets/group2214.png')} 
          // style={styles.badgeImage}
          style={[
            styles.badgeImage,
            // index !== 0 && styles.greyBadgeImage, 
            index >= 1 && styles.greyBadgeImage,
          ]}
        />
        {/* <Text style={styles.badgeText}>{badgeName}</Text> */}
        <Text
          style={[
            styles.badgeText,
            // index !== 0 && styles.greyBadgeText, 
            index >= 1 && styles.greyBadgeImage,
          ]}
        >
          {badgeName}
        </Text>
      </View>
    ))}
          {/* {Array(6).fill().map((_, index) => (
            <View key={index} style={styles.badgeContainer}>
              <Image
                source={require('../../../assets/group2214.png')} 
                style={styles.badgeImage}
              />
              <Text style={styles.badgeText}>{index % 2 === 0 ? 'Champion' : 'Pro Champ'}</Text>
            </View>
          ))} */}
        </View>
      </View>

      {/* Weekly Streaks Section */}
      <View style={styles.streaksSection}>
        <View style={styles.streaksHeader}>
          <Text style={styles.streaksTitle}>Streaks</Text>
          {/* <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.streaksContainer}>
          {["Thur", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day, index) => (
            <View key={index} style={styles.streakDayContainer}>
              <View style={[
                styles.streakCircle,
                index < 1 ? styles.activeStreak : styles.inactiveStreak 
              ]}>
                {index < 1 && <Text style={styles.streakCount}>{index + 1}</Text>}
              </View>
              <Ionicons 
                name="flame" 
                size={20} 
                color={index < 1 ? "#FF7A00" : "#C4C4C4"} 
              />
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Coin Streaks Section */}
      <View style={styles.coinStreaksSection}>
        <View style={styles.streaksHeader}>
          <Text style={styles.streaksTitle}>Levels</Text>
          {/* <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.coinStreaksGrid}>
          {Array(6).fill().map((_, index) => (
            <View key={index} style={[styles.coinContainer, index === 0 ? styles.activeCoinContainer : styles.inactiveCoinContainer]}>
              <Text style={[styles.coinText, index === 0 && { color: "white" }]}>{120 + index * 300} coins</Text>
              {/* <Text style={[styles.coinText, index === 0 && { color: "white" }]}>100 coins</Text> */}
              {/* <Ionicons name="logo-bitcoin" size={24} color={index === 0 ? "white" : "#FFD700"} /> */}
              <Image
                source={require('../../../assets/coinImage.png')} 
              />
              <Text style={[styles.coinLevel, index === 0 && { color: "white" }]}>Level {index + 1}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4faff',
  },
  container: {
    flex: 1,
    // backgroundColor: '#F4FAFF',
    paddingHorizontal: 20,
    fontFamily: 'DM Sans',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsIcon: {
    padding: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  greyBadgeImage: {
    tintColor: 'grey', 
  },
  greyBadgeText: {
    color: 'grey', 
  },
  userLevel: {
    fontSize: 16,
    color: 'gray',
  },
  scoreContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  scoreBox: {
    flexDirection: 'row',
    backgroundColor: '#02006C',
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalScoreText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
    alignItems: 'center',
    textAlign: 'center',
    // justifyContent: 'center'
  },
  scorePoints: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgesSection: {
    marginTop: 30,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
  streaksSection: {
    marginTop: 30,
  },
  streaksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streaksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  streaksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakDayContainer: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeStreak: {
    backgroundColor: '#FFEBB3',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  inactiveStreak: {
    backgroundColor: '#E0E0E0',
  },
  streakCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7A00',
  },
  dayText: {
    fontSize: 12,
    color: '#000',
  },
  coinStreaksSection: {
    marginTop: 30,
  },
  coinStreaksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  coinContainer: {
    width: '30%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  activeCoinContainer: {
    backgroundColor: '#02006C',
  },
  inactiveCoinContainer: {
    backgroundColor: '#F0F0F0',
  },
  coinText: {
    fontSize: 14,
    marginTop: 5,
    color: '#000',
  },
  coinLevel: {
    fontSize: 12,
    color: '#000',
  },
});

export default ProfileScreen;










