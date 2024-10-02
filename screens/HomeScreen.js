import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [nextWalk, setNextWalk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchNextWalk();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // console.log('No user data found. Redirecting to questionnaire.');
        navigation.replace('Questionnaire');
      }
    } catch (error) {
      // console.error('Error fetching user data:', error);
      // Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextWalk = async () => {
    try {
      const userId = auth.currentUser.uid;
      const now = new Date();
      // console.log('Fetching walks for user:', userId);
      // console.log('Current date:', now.toISOString());
      const walksQuery = query(
        collection(db, 'walks'),
        where('userId', '==', userId),
        where('date', '>=', now.toISOString().split('T')[0]),
        orderBy('date'),
        orderBy('time'),
        limit(1)
      );
      const querySnapshot = await getDocs(walksQuery);
      if (!querySnapshot.empty) {
        const nextWalkData = querySnapshot.docs[0].data();
        setNextWalk(nextWalkData);
      } else {
        setNextWalk(null);
      }
    } catch (error) {
      setNextWalk(null);
      Alert.alert('Error', 'Failed to fetch the next walk. Please try again later.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  const handleSchedule = () => {
    navigation.navigate('ScheduleScreen');
  };
  const handleViewAllWalks = () => {
    navigation.navigate('AllWalks');
  };
  const handleViewAllFavPlaces = () => {
    navigation.navigate('AllFavouritePlaces');
  };
  // const handleAddPlace = () => {
  //   navigation.navigate('AddPlace');
  // }


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>No user data found. Please complete the questionnaire.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Questionnaire')}>
          <Text style={styles.buttonText}>Go to Questionnaire</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.welcomeHi}>
        <Text style={styles.title}>Hi, {userData.name}!</Text>
        {/* <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.linkText}>Edit Profile</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={styles.infoContainerPet}>
          <Text style={styles.headerThree}>Your pets</Text>
          <View style={styles.petCard}>
            <Image source={require('../assets/dog-profile.png')} style={styles.dogProfileImg} />
            <Text style={styles.dogNameText}>{userData.dogName}</Text>
            <Text style={styles.petInfoText}>{userData.dogBreed}</Text>
            <Text style={styles.petInfoText}>{userData.dogDOB}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>

          <Text style={styles.headerThree}>Next Planned Walks</Text>
          {nextWalk ? (
            <View style={styles.walkCard}>
              <Text style={styles.infoText}>Date: {nextWalk.date}</Text>
              <Text style={styles.infoText}>Time: {nextWalk.time}</Text>
              {nextWalk.notes && <Text style={styles.infoText}>Notes: {nextWalk.notes}</Text>}
            </View>
          ) : (
            <Text style={styles.walksInfoText}>No upcoming walks scheduled</Text>
          )}
          {/* <TouchableOpacity onPress={handleViewAllFavPlaces}>
        <Text style={styles.headerThree}>Your favourite places to walk</Text>
      </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={handleAddPlace}>
        <Text style={styles.linkText}>Add new place</Text>
      </TouchableOpacity> */}
        </View>


        <TouchableOpacity style={styles.button} onPress={handleSchedule}>
          <Text style={styles.buttonText}>Schedule Walks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleViewAllWalks}>
          <Text style={styles.buttonText}>View All Walks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleEditProfile}>
          <Text style={styles.linkText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#e6e2dd', //grey
    height: '100%',
    position: 'relative',
    marginTop: 130,
  },
  welcomeHi: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#efd39b', //yellow
    paddingTop: 70,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    paddingHorizontal: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    paddingLeft: 20,
  },
  infoContainer: {
    marginBottom: 20,
    width: '100%',
  },
  infoContainerPet: {
    marginBottom: 20,
    width: '50%',
    alignContent: 'center'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  petInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  walksInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  dogNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#f0b664'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0b664', //orange
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#828fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerThree: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  petCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
  },
  walkCard: {
    backgroundColor: '#828fff', //purple
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,

  },
  dogProfileImg: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  linkButton: {
    marginBottom: 10,
    marginTop: 20,
    justifyContent: 'flex-center',

  }

});