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

/*
[users]
	nickname
	고유 id
  최고점
  
[게임 방]
	고유값(주소)
	?? 조인한 사람들
	isplaying
	[이번 게임]
		시작한 시간
		초성
		정답으로 입력된 단어

    */