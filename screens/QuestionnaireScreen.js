import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Location from 'expo-location';

export default function QuestionnaireScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogDOB, setDogDOB] = useState('');
  // const [walksPerDay, setWalksPerDay] = useState('');
  // const [walkDuration, setWalkDuration] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, 'users', userId), {
        name,
        dogName,
        dogBreed,
        dogDOB,
        // walksPerDay,
        // walkDuration,
        location: location ? `${location.coords.latitude}, ${location.coords.longitude}` : 'Not provided'
      });

      Alert.alert('Success', 'Your information has been saved!', [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Location Permission: {location ? 'Granted' : 'Not Granted'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Dog's Name"
        value={dogName}
        onChangeText={setDogName}
      />

      <TextInput
        style={styles.input}
        placeholder="Dog's Breed"
        value={dogBreed}
        onChangeText={setDogBreed}
      />

      <TextInput
        style={styles.input}
        placeholder="Dog's Date of Birth (DD/MM/YYYY)"
        value={dogDOB}
        onChangeText={setDogDOB}
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Walks per Day"
        value={walksPerDay}
        onChangeText={setWalksPerDay}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Average Walk Duration (minutes)"
        value={walkDuration}
        onChangeText={setWalkDuration}
        keyboardType="numeric"
      /> */}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0b664',
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
});