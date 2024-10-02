import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function EditProfileScreen({ route, navigation }) {
  const { userData } = route.params;
  const [name, setName] = useState(userData.name);
  const [dogName, setDogName] = useState(userData.dogName);
  const [dogBreed, setDogBreed] = useState(userData.dogBreed);
  const [dogDOB, setDogDOB] = useState(userData.dogDOB);
  const [walksPerDay, setWalksPerDay] = useState(userData.walksPerDay);
  const [walkDuration, setWalkDuration] = useState(userData.walkDuration);

  const handleUpdate = async () => {
    try {
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, 'users', userId), {
        name,
        dogName,
        dogBreed,
        dogDOB,

      });

      Alert.alert('Success', 'Your information has been updated!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Profile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

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
{/* 
      <TextInput
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

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
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
        backgroundColor: '#007AFF',
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