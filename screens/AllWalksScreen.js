import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AllWalksScreen({navigation}) {
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewMap = () => {
    navigation.navigate('Map');
  };

  useEffect(() => {
    fetchAllWalks();
  }, []);

  const fetchAllWalks = async () => {
    try {
      const walksQuery = query(
        collection(db, 'walks'),
        orderBy('date'),
        orderBy('time'),
        limit(50) //Limit
      );
      const querySnapshot = await getDocs(walksQuery);
      const fetchedWalks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWalks(fetchedWalks);
    } catch (error) {
      console.error('Error fetching walks:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWalkItem = ({ item }) => (
      <View style={styles.walkItem}>
        <Text style={styles.walkText}>Date: {item.date}</Text>
        <Text style={styles.walkText}>Time: {item.time}</Text>
        <Text style={styles.walkText}>User: {item.userName || 'Anonymous'}</Text>
        {item.notes && <Text style={styles.walkText}>Notes: {item.notes}</Text>}
      </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Scheduled Walks</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleViewMap}>
      <Text style={styles.buttonText}>View Walks on Map</Text>
    </TouchableOpacity>
      </View>
      <FlatList
        data={walks}
        renderItem={renderWalkItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  walkItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  walkText: {
    fontSize: 16,
    marginBottom: 5,
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