// Import the functions you need from the SDKs you need

import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDbjjnZOdsGJA590hqsNmPVseMUWuHK3NE',
  authDomain: 'save-station.firebaseapp.com',
  projectId: 'save-station',
  storageBucket: 'save-station.appspot.com',
  messagingSenderId: '1008048555511',
  appId: '1:1008048555511:web:02d2ceef2c5f160732daf2',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
