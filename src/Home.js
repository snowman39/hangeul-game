import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sejong from './Sejong.png';
import logo from './MainLogo.png';
import bottom from './Bottom.png';
import light from './Light.png';
import arrow from './Arrow.png';
import './Home.css';

import { firestore } from "./Firebase";

export default function Home() {
    const [name, setName] = useState(null);
    const [code, setCode] = useState(null);
    const [login, setLogin] = useState(0);
//    const [login, setLogin] = useState(localStorage.getItem('uid') ? 1:0);
    const onStart = (e) => {
        e.preventDefault();
        document.getElementById('start').style.display = "none";
        document.getElementsByClassName('login-field')[0].style.display = "block";
    };
    const onPlay = (e) => {
        e.preventDefault();
        document.getElementById('play').style.display = "none";
        document.getElementsByClassName('enter-room')[0].style.display = "block";
        document.getElementsByClassName('new-room')[0].style.display = "block";
    }
    const onLogin = (e) => {
        e.preventDefault();
        if (!name) {
          return alert('별명을 입력하세요.');
        }
        firestore.collection('users').add({user:name})
            .then(res=>{
                localStorage.setItem('uid', res.id);
                firestore.collection('users').get()
                    .then(docs => {
                        docs.forEach(doc => {
                            if(doc.id === res.id) localStorage.setItem('userName', doc.data().user);
                            console.log("log in changed");
                            setLogin(1);
                        })
                    })
            })
    }
    const onEnter = (e) => {
        e.preventDefault();
        if (!code)  return alert('암호를 입력하세요.');
        let roomRef = firestore.collection('rooms').doc(code);

        firestore.collection('users').add({user:name})


        roomRef.get().then(function(doc) {
            if(doc.exists) {
                roomRef.update(        //doc 안에 있는 data를 어떻게 받아와야할까?
                    { users: [{user: localStorage.getItem('userName')}]}
                        );
            }
            else {
                return alert("Sorry, we don't have a room like that");
            }
        })
        .catch(function(error){
            return alert(error);
        })

        
    }
    const onNew = (e) => {
        e.preventDefault();
        if(! code)  return alert('암호를 입력하세요.');
        firestore.collection('rooms').doc(code).get().then(function(doc)
        {
            if(doc.exists)
            {
                return alert('Sorry, already have it');
            }
            else{
                firestore.collection('rooms').doc(code).set(
                    { users: [{user: localStorage.getItem('userName')}]},
                    { merge: true }
                )
        
            }
        })
        .catch(function(error){
            return alert(error);
        });



    }
    console.log("log in doesn't have a problem", login);
    return (
        <div className="background">  
            <div>
            <div className ="rank">
                <Link exact to="/Rank">
                <img src = {sejong} className="sejong" alt="명예의 전당"/>
                </Link>
            </div>
            <div>
                <img src={logo} className="main-logo" alt="로고"/>
            </div>
            <div>
                <img src={bottom} className="bottom" alt="바닥"/>
            </div>
            <div>
                <img src={light} className="light1" alt="빛"/>
                <img src={light} className="light2" alt="빛"/>
                <img src={light} className="light3" alt="빛"/>
                <img src={light} className="light4" alt="빛"/>
                <img src={light} className="light5" alt="빛"/>
            </div>
            <div>
                
                {login === 0 &&
                    <button id="start" alt="시작" onClick={onStart}>
                        <div className="button-text">
                            동전 넣기
                        </div>
                        <img src={arrow} className="arrow" alt="화살표"/>
                    </button>
                }
                {login === 0 &&
                <button className="login-field">
                    <form onSubmit={onLogin}>
                        <input type="text" name="name" placeholder="별명 입력.." onChange={(e) => setName(e.target.value)} className="login"/>
                        <input type="image" src={arrow} alt="로그인" className="arrow"/>
                    </form>
                </button>
                }
                {login > 0 &&
                    <button id="play" onClick={onPlay}>
                        <div className="button-text2">
                            방 들어가기
                        </div>
                        <img src={arrow} className="arrow" alt="화살표"/>
                    </button>
                }
                {login > 0 &&
                    <div>
                        <button className="enter-room">
                            <div className="button-text3">기존 방</div>
                            <form onSubmit={onEnter}>
                                <input type="text" name="code" placeholder="암호.." onChange={(e) => setCode(e.target.value)} className="enter"/>
                                <input type="image" src={arrow} alt="들어가기" className="arrow"/>
                            </form>
                        </button>
                        <button className="new-room">
                            <div className="button-text3">새로운 방</div>
                            <form onSubmit={onNew}>
                                <input type="text" name="code" placeholder="암호.." onChange={(e) => setCode(e.target.value)} className="new"/>
                                <input type="image" src={arrow} alt="들어가기" className="arrow"/>
                            </form>
                            <img src={arrow} className="arrow" alt="만들기"/>
                        </button>
                    </div>
                }
            </div>
            </div>
        </div>
    );
}