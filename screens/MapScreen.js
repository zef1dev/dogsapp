import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [walks, setWalks] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();

    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    try {
      const walksCollection = collection(db, 'walks');
      const walkSnapshot = await getDocs(walksCollection);
      const walkList = walkSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        coordinate: {
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
        }
      }));
      setWalks(walkList);
    } catch (error) {
      console.error('Error fetching walks: ', error);
    }
  };

  if (!region) {
    return <View style={styles.container}><Text>Loading map...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
      >
        {walks.map((walk) => (
          <Marker
            key={walk.id}
            coordinate={walk.coordinate}
            title={walk.userName}
            description={`${walk.date} at ${walk.time}`}
          />
        ))}
      </MapView>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});