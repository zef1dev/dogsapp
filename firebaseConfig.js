import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBKvvtntRm3MtEKnM1XJfNVfnQhveZoCCU",
    authDomain: "dogwalker-2d1bf.firebaseapp.com",
    projectId: "dogwalker-2d1bf",
    storageBucket: "dogwalker-2d1bf.appspot.com",
    messagingSenderId: "858022352159",
    appId: "1:858022352159:web:69ede5038f70c443bacc2a"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db };