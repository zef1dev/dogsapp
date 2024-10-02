import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function AllWalksScreen({navigation}) {
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewMap = () => {
    navigation.navigate('Map');
  };

  useEffect(() => {
    console.log("AllWalksScreen mounted");
    fetchAllWalks();
  }, []);

  const fetchAllWalks = async () => {
    console.log("Fetching walks...");
    try {
      const walksQuery = query(
        collection(db, 'walks'),
        orderBy('date'),
        orderBy('time'),
        limit(50)
      );
      const querySnapshot = await getDocs(walksQuery);
      console.log("Walks fetched:", querySnapshot.size);
      const fetchedWalks = querySnapshot.docs.map(doc => {
        console.log("Walk data:", doc.data());
        return { id: doc.id, ...doc.data() };
      });
      setWalks(fetchedWalks);
    } catch (error) {
      console.error('Error fetching walks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWalk = (walk) => {
    if (walk.userId === auth.currentUser.uid) {
      Alert.alert("Can't Join", "This is your own walk!");
    } else {
      navigation.navigate('Message', { walkId: walk.id, walkOwner: walk.userName });
    }
  };

  const renderWalkItem = ({ item }) => (
    <View style={styles.walkItem}>
      <Text style={styles.walkText}>Date: {item.date}</Text>
      <Text style={styles.walkText}>Time: {item.time}</Text>
      <Text style={styles.walkText}>User: {item.userName || 'Anonymous'}</Text>
      {item.notes && <Text style={styles.walkText}>Notes: {item.notes}</Text>}
      <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinWalk(item)}>
        <Text style={styles.joinButtonText}>Join Walk</Text>
      </TouchableOpacity>
    </View>
  );

  console.log("Rendering AllWalksScreen. Loading:", loading, "Walks:", walks.length);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (walks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No walks scheduled</Text>
        <TouchableOpacity style={styles.button} onPress={handleViewMap}>
          <Text style={styles.buttonText}>View Walks on Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Scheduled Walks</Text>
      <TouchableOpacity style={styles.button} onPress={handleViewMap}>
        <Text style={styles.buttonText}>View Walks on Map</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  joinButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});