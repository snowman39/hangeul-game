import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAkHP6r0bk9wGTFBtvvI-3ejTK90C8FjNk",
    authDomain: "hangeul-game.firebaseapp.com",
    databaseURL: "https://hangeul-game.firebaseio.com",
    projectId: "hangeul-game",
    storageBucket: "hangeul-game.appspot.com",
    messagingSenderId: "93768313134",
    appId: "1:93768313134:web:1bda22e43fd32f1c02f2bf"
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