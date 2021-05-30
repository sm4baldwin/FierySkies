// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app'

// Add the Firebase products that you want to use
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC7UpBZGlE0D4Q3tWtGt4QMPokv5tEtFX0",
    authDomain: "fieryskies.firebaseapp.com",
    databaseURL: "https://fieryskies.firebaseio.com",
    projectId: "fieryskies",
    storageBucket: "fieryskies.appspot.com",
    messagingSenderId: "414359756563",
    appId: "1:414359756563:web:3e160c4124e01fe5ec04e6",
    measurementId: "G-HC0WLC2PFX"
  }
const firebaseApp = initializeApp(firebaseConfig)
export const firestore = getFirestore(firebaseApp)