import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBlKqlvlqWzRMYFhKmdw4qRX0Th9kR7QQE",
    authDomain: "hangeultw.firebaseapp.com",
    databaseURL: "https://hangeultw.firebaseio.com",
    projectId: "hangeultw",
    storageBucket: "hangeultw.appspot.com",
    messagingSenderId: "2214322526",
    appId: "1:2214322526:web:c598fbe7d506146a806fcf"
  };

firebase.initializeApp(firebaseConfig);
const firestore = new firebase.firestore();

export { firestore }