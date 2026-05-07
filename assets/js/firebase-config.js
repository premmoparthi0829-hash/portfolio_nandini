// Your Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAdrPnBGcVyyThIr6i-gCEnQ2OZvgdMf74",
    authDomain: "nandini-portfolio-31.firebaseapp.com",
    projectId: "nandini-portfolio-31",
    storageBucket: "nandini-portfolio-31.firebasestorage.app",
    messagingSenderId: "105491531330",
    appId: "1:105491531330:web:10162797c89d5478240fdb",
    measurementId: "G-FR14YR4LVK"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
