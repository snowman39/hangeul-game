import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEtZ0q3pXrYbVuxazduAMWgSR92LFGGQs",
  authDomain: "hun-min-jeong-eum.firebaseapp.com",
  databaseURL: "https://hun-min-jeong-eum.firebaseio.com",
  projectId: "hun-min-jeong-eum",
  storageBucket: "hun-min-jeong-eum.appspot.com",
  messagingSenderId: "265315536276",
  appId: "1:265315536276:web:f2c23770e1ad86f3f79381"
};

firebase.initializeApp(firebaseConfig);
const firestore = new firebase.firestore();

export { firestore };
