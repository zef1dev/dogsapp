import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import HomeScreen from './screens/HomeScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import AllWalksScreen from './screens/AllWalksScreen';
import MapScreen from './screens/MapScreen';
import AllFavouritePlaces from './screens/AllFavouritePlaces';
import Addplace from './screens/AddPlace';
import IconButton from './components/UI/iconButton';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            <Stack.Screen name="AllWalks" component={AllWalksScreen} />
            <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="AllFavouritePlaces" component={AllFavouritePlaces} options={({ navigation }) => {
               headerRight: ({tintColor}) => <IconButton icon="add" size={24} color={tintColor} onPress={() => navigation.navigate('AddPlace')}/> 
            }}/>
            
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}