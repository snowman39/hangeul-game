import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import logo from './images/Logo.png';
import sejong from './images/Sejong.png';
import box from './images/HelpBox.png';
import scoreBox from './images/ScoreBox.png';
import playBox from './images/PlayBox.png';
import bubble from './images/WordBubble.png';
import axios from 'axios'
import './Room.css';
import { firestore } from "./Firebase";

const APP_KEY = "80BDA3A34160D126F3FB4094CBE073EF"

export default function Rank() {
    const [word, setWord] = useState(null);
    const [ready, setReady] = useState(localStorage.getItem('ready') ? 1:0);
    const [allReady, setAllReady] = useState(localStorage.getItem('start')? 1:0);
    const convert = require('xml-js');;
<<<<<<< HEAD
    const timer = (sec) => {
        let timer = document.getElementById("timer")
        timer.innerHTML = sec
        setInterval(() => {      
        timer.innerHTML -= 1;
        }, 1000)
    }
<<<<<<< HEAD


    const onGamestart = (e) => {                //게임 시작 버튼을 누르면 하는 것
        e.preventDefault();
        let roomRef = firestore.collection('rooms').doc(code);
        roomRef.get().then(function(doc) {
//                let users_local = doc.data().users;                             //users 목록을 users_local로 받아옴
                roomRef.set(
                    {
                        users: doc.data().users,
                        how_many: doc.data().how_many + 1 ,
                        time_started: doc.data().time_started,
                        round_control: [{round_no: doc.data().round_control[1]+1},{given_chosung: ""},{answers: []},{time_started: doc.data().round_control[3]}]
                    }
                        );
                        console.log("게임 시작 버튼 눌렀을 때 roomref.get: ", doc);
            })
            .catch(function(error){
                return alert(error);
            })
    }
        


=======
>>>>>>> 31b0935805160c652ac9c6f8c92295e590dcae8f
=======
    // const timer = (sec) => {

    //     let timer = document.getElementById("timer")
    //     timer.innerHTML = sec
    //     setInterval(() => {      
    //     timer.innerHTML -= 1;
    //     }, 1000)
    // }
>>>>>>> c6626cbef2e37bca41d9130cdaa91af1b6df4af4
    const checkWord = (e) => {
        e.preventDefault(); 
        document.getElementById("wordBox").value = ""
        let inputConsonant = checkChosung(word);
        let consonant = document.getElementById('consonant').innerHTML
        if (inputConsonant === consonant) {
        console.log("자음 일치!") 
        axios.get(`https://cors-anywhere.herokuapp.com/https://krdict.korean.go.kr/api/search?certkey_no=1154&key=${APP_KEY}&type_search=search&method=WORD_INFO&part=word&q=${word}&sort=dict`, {
        })
        .then(response => {
            const result = convert.xml2json(response.data, {compact: true, spaces: 4});
            return JSON.parse(result)
        })
        .then(response => {
            if (response.channel.item) {
            console.log("PASS")
            if ((response.channel.item).length > 1) {
                if ((response.channel.item[0].sense).length > 1) {
                console.log(response.channel.item[0].sense[0].definition._text)
                }
                else {
                console.log(response.channel.item[0].sense.definition._text)
                }
            } else if ((response.channel.item).length === 1) {
                console.log(response.channel.item.sense.definition._text)
            } else {
                console.log("오, 이런 어려운 단어도 알다니! 아주 칭찬해~")
            }
            } else {
            console.log("WRONG")
            }
        })
        } else {
        console.log("자음 불일치!") 
        }
    }
    // const randomChosung = (n) => {
    //     const consonantList = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ", "ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    //     const shuffleConsonants = shuffle(consonantList);
    //     console.log(shuffleConsonants);
    //     const consonants = shuffleConsonants.slice(0, n).join("")
    //     document.getElementById('consonant').innerHTML = consonants
    // }
    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    console.log(allReady);
    useEffect(() => {
        setInterval(()=>{
            let roomRef = firestore.collection('rooms').doc(localStorage.getItem('code'));
            roomRef.get().then((docs) => {
                let users_local = docs.data().users;
                let readyCount = 0;
                users_local.forEach((user) => {
                    if(user.is_ready) readyCount = readyCount+1;
                })
                if(readyCount === docs.data().how_many) {
                    setAllReady(1);
                    localStorage.setItem('start', '1');
                }
            })
        },10000000);
    }, [])
    if(allReady) {
        
    } //이거 암것도 안해도 두 번씩 실행되는데 이유좀 알려주세요 & 입력할 때 마다 초성 바뀜 ㅋㅋㅋㅋㅋㅋ, localstorage 'start'로 처리해도 될 것 같은데 뭔가 오류났었어서 보류
    const checkChosung = (str) => {
        const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
        let result = "";
        for(let i=0; i<str.length; i++) {
        let code = str.charCodeAt(i)-44032;
        if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
        }
        return result;
    }
    const onReady = (e) => {
        e.preventDefault();
        let roomRef = firestore.collection('rooms').doc(localStorage.getItem('code'));
        roomRef.get().then((docs) => {
            let users_local = docs.data().users
            users_local.forEach((user) => {
                if(user.user === localStorage.getItem('uid'))  user.is_ready = true;
            })
            roomRef.set(
                {
                users: users_local,
                how_many: docs.data().how_many,
                is_playing: false,
                round_control: [{round_no: 0}, {given_chosung: ""}, {answers: []}, {time_started: 0}]
                }).then(()=>{
                    localStorage.setItem('ready', '1');
                    setReady(1);
                }).catch((err) => { 
                    return alert(err);
                })
        }).catch((err) => {
            return alert(err);
        })
    }
    const onNotReady = (e) => {
        e.preventDefault();
        let roomRef = firestore.collection('rooms').doc(localStorage.getItem('code'));
        roomRef.get().then((docs) => {
            let users_local = docs.data().users
            users_local.forEach((user) => {
                if(user.user === localStorage.getItem('uid'))  user.is_ready = false;
            })
            roomRef.set(
                {
                users: users_local,
                how_many: docs.data().how_many,
                is_playing: false,
                round_control: [{round_no: 0}, {given_chosung: ""}, {answers: []}, {time_started: 0}]
                }).then(()=>{
                    localStorage.removeItem('ready');
                    setReady(0);
                }).catch((err) => { 
                    return alert(err);
                })
        }).catch((err) => {
            return alert(err);
        })
    }
    const onGameStart = (e) => {
        e.preventDefault();
        const consonantList = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ", "ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
        const shuffleConsonants = shuffle(consonantList);
        let roomRef = firestore.collection('rooms').doc(localStorage.getItem('code'));
        roomRef.get().then((docs) => {
            roomRef.set(
                {
                users: docs.data().users,
                how_many: docs.data().how_many,
                is_playing: true,
                round_control: [{round_no: 1}, {given_chosung: shuffleConsonants.slice(0, 2).join("")}, {answers: []}, {time_started: Date.now()}]
                })
        }).catch((err)=>{
            return alert(err);
        })
    }
    return (
        <div className="background">  
          <div>
            <div className="king">
                <img src={sejong} className="king" alt="왕"/>
            </div>
            <img src={bubble} className="bubble" alt="말풍선"/>
            <div className="help">
                <img src={box} className="box" alt="설명"/>
            </div>
            <div className ="logo">
                <img src={logo} className="logo" alt="로고"/>
            </div>
            <img src={playBox} className="play-box" alt="게임판"/>
            <div className="consonant"></div>
            {allReady === 0 & ready === 0 &&
                <button id="ready" onClick={onReady}>
                    <div className="button-text4">
                        준비하기!
                    </div>
                </button>
            }
            {allReady === 0 & ready > 0 &&
                <button id="not-ready" onClick={onNotReady}>
                    <div className="button-text4">
                        준비 해제!
                    </div>
                </button>
            }
            <span id="consonant"></span> 
            <span id="rest-time">남은 시간:</span>
            <span id="timer"></span>
            {allReady > 0 && localStorage.getItem('master') &&
                <button id="game-start" onClick={onGameStart}>
                    게임 시작!
                </button>
                // <form onSubmit={checkWord}>
                //     <label> 단어를 입력하세요: </label> 
                //     <input type="text" id="wordBox" placeholder="단어 입력.." onChange={(e) => {setWord(e.target.value)}} />
                // </form>
            }
            {

            }
            <img src={scoreBox} className="score-box" alt="점수판"/>
            <div className="score-list">
                    뿌꾸뿌꾸: 2560점
            </div>
          </div>
      </div>
    )
}