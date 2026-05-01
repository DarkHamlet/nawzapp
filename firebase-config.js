/* ÑawzApp — Firebase config & init */
const firebaseConfig = {
  apiKey:            "AIzaSyA6Tw15SuzqUenJ8gC0u3i4yr0swqFWykI",
  authDomain:        "nawzapp.firebaseapp.com",
  projectId:         "nawzapp",
  storageBucket:     "nawzapp.firebasestorage.app",
  messagingSenderId: "915462440076",
  appId:             "1:915462440076:web:50912fcb8cdf562021e7a9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
