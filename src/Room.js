import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import logo from './Logo.png';
import sejong from './Sejong.png';
import box from './HelpBox.png';
import scoreBox from './ScoreBox.png';
import playBox from './PlayBox.png';
import bubble from './WordBubble.png';
import axios from 'axios'
import './Room.css';

const APP_KEY = "80BDA3A34160D126F3FB4094CBE073EF"

export default function Rank() {
    const [word, setWord] = useState(null);
      const convert = require('xml-js');

    const timer = (sec) => {
        let timer = document.getElementById("timer")
        timer.innerHTML = sec
        setInterval(() => {      
        timer.innerHTML -= 1;
        }, 1000)
    }

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

    const randomChosung = (n) => {
        const consonantList = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ", "ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
        const shuffleConsonants = shuffle(consonantList);
        console.log(shuffleConsonants);
        const consonants = shuffleConsonants.slice(0, n).join("")
        document.getElementById('consonant').innerHTML = consonants
    }

    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    useEffect(() => {
        console.log("set new chosung")
        randomChosung(2)  
        timer(60)
    }, [])

    const checkChosung = (str) => {
        const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
        let result = "";
        for(let i=0; i<str.length; i++) {
        let code = str.charCodeAt(i)-44032;
        if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
        }
        return result;
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
            <span id="consonant"></span> 
            <span id="rest-time">남은 시간:</span>
            <span id="timer"></span>
            <form onSubmit={checkWord}>
                <label> 단어를 입력하세요: </label> 
                <input type="text" id="wordBox" placeholder="단어 입력.." onChange={(e) => {setWord(e.target.value)}} />
            </form>
            <img src={scoreBox} className="score-box" alt="점수판"/>
            <div className="score-list">
                    뿌꾸뿌꾸: 2560점
            </div>
          </div>
      </div>
    )
}