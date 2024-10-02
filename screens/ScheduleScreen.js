import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Location from 'expo-location';


export default function ScheduleScreen() {
  const [walkDate, setWalkDate] = useState(new Date());
  const [walkTime, setWalkTime] = useState(new Date());
  const [walkNotes, setWalkNotes] = useState('');
  const [dogWalks, setDogWalks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchWalks = async () => {
    try {
      const userId = auth.currentUser.uid;
      const walksQuery = query(collection(db, 'walks'), where('userId', '==', userId));
      const querySnapshot = await getDocs(walksQuery);
      const fetchedWalks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDogWalks(fetchedWalks);
    } catch (error) {
      console.error('Error fetching walks:', error);
      Alert.alert('Error', 'Failed to load scheduled walks. Please try again.');
    }
  };

  const addWalkHandler = async () => {
    if (walkDate && walkTime) {
      try {
        const userId = auth.currentUser.uid;
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userName = userDoc.exists() ? userDoc.data().name : 'Anonymous';
  
        let location = await Location.getCurrentPositionAsync({});
  
        const newWalk = {
          userId,
          userName,
          date: walkDate.toISOString().split('T')[0],
          time: walkTime.toTimeString().split(' ')[0],
          notes: walkNotes,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          createdAt: new Date().toISOString(),
        };
  
        const docRef = await addDoc(collection(db, 'walks'), newWalk);
        setDogWalks(currentDogWalks => [...currentDogWalks, { id: docRef.id, ...newWalk }]);
        
        // Reset input fields
        setWalkDate(new Date());
        setWalkTime(new Date());
        setWalkNotes('');
        
        Alert.alert('Success', 'Walk scheduled successfully!');
      } catch (error) {
        console.error('Error adding walk:', error);
        Alert.alert('Error', 'Failed to schedule walk. Please try again.');
      }
    }
  };

  const deleteWalkHandler = async (id) => {
    try {
      await deleteDoc(doc(db, 'walks', id));
      setDogWalks(currentDogWalks => currentDogWalks.filter(walk => walk.id !== id));
      Alert.alert('Success', 'Walk deleted successfully!');
    } catch (error) {
      console.error('Error deleting walk:', error);
      Alert.alert('Error', 'Failed to delete walk. Please try again.');
    }
  };

  const renderWalkItem = ({ item }) => (
    <View style={styles.walkItem}>
      <Text>{item.date} at {item.time}</Text>
      {item.notes ? <Text>Notes: {item.notes}</Text> : null}
      <TouchableOpacity onPress={() => deleteWalkHandler(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || walkDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWalkDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || walkTime;
    setShowTimePicker(Platform.OS === 'ios');
    setWalkTime(currentTime);
  };

  React.useEffect(() => {
    fetchWalks();
  }, []);

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Schedule your dog walks</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
          <Text>Select Date: {walkDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={walkDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
          <Text>Select Time: {walkTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={walkTime}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
        <TextInput
          placeholder='Notes (optional)'
          style={styles.textInput}
          value={walkNotes}
          onChangeText={setWalkNotes}
        />
        <Button title='Schedule Walk' onPress={addWalkHandler} />
      </View>
      <View style={styles.walksContainer}>
        <Text style={styles.subtitle}>Scheduled Walks</Text>
        <FlatList
          data={dogWalks}
          renderItem={renderWalkItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff8f3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#575fcc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  walksContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
  },
  walkItem: {
    backgroundColor: '#ff6D3B',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: 'white',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#575fcc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});