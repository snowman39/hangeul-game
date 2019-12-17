import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sejong from './images/Sejong.png';
import logo from './images/MainLogo.png';
import bottom from './images/Bottom.png';
import light from './images/Light.png';
import arrow from './images/Arrow.png';
import './Home.css';

import { firestore } from "./Firebase";

export default function Home() {
    const [name, setName] = useState(null);
    const [code, setCode] = useState(null);
    const [login, setLogin] = useState(localStorage.getItem('uid') ? 1:0);
    const onStart = (e) => {
        e.preventDefault();
        document.getElementById('start').style.display = "none";
        document.getElementsByClassName('login')[0].style.display = "block";
    };
    const onPlay = (e) => {
        e.preventDefault();
        document.getElementById('play').style.display = "none";
        document.getElementsByClassName('enter-room')[0].style.display = "block";
        document.getElementsByClassName('new-room')[0].style.display = "block";
    }
    const onLogin = (e) => {
        e.preventDefault();
        if (!name)  return alert('별명을 입력하세요.');
        firestore.collection('users').doc(name).get()
        .then((doc) => {
            if(doc.exists) return alert('이미 있는 별명입니다.');
            else{
                firestore.collection('users').doc(name).set(
                    {
                    user: name,
                    best_score: 0
                    }
                )}
                localStorage.setItem('uid', name);
                setLogin(1);
        })
        .catch((error) => {
            return alert(error);
        })
    }
    const onNew = (e) => {
        e.preventDefault();
        if(!code)  return alert('암호를 입력하세요.');
        firestore.collection('rooms').doc(code).get()
        .then((doc) => {
            if(doc.exists)  return alert('이미 있는 방입니다.');
            else  {
                firestore.collection('rooms').doc(code).set(
                    {
                        users: [{user: localStorage.getItem('uid'), score_thisgame: 0}],
                        how_many: 1
                    },
                    { merge: true },
                )
                localStorage.setItem('code', code);
                window.location = `Room/${localStorage.getItem('code')}`
            }
        })
        .catch((error) => {
            return alert(error);
        });
    }
    const onEnter = (e) => {
        e.preventDefault();
        if (!code)  return alert('암호를 입력하세요.');
        let roomRef = firestore.collection('rooms').doc(code);
        roomRef.get().then((doc) => {
            if(doc.exists) {
                let users_local = doc.data().users;                             //users 목록을 users_local로 받아옴
                let found = false;
                users_local.forEach((user) => {
                    if(user.user === localStorage.getItem('uid'))  found = true;
                })                                                              //users_local 안에 이미 이 사람이 존재하는지 존재하지 않는지 확인(found로)
                if(!found)                                                      //새로온 유저라면
                {
                users_local = users_local.concat([{user: localStorage.getItem('uid'), score_thisgame: 0}]);       //users를 새로 update
                roomRef.set(
                    {
                        users: users_local,
                        how_many: doc.data().how_many + 1
                    })
                    .then(() => {
                        localStorage.setItem('code', code);
                        window.location = `Room/${localStorage.getItem('code')}`
                    })
                    .catch((error) => {
                        return alert("단어 입력에 실패했어요!" + error)
                    });
                }
            }
            else {
                return alert("해당 암호에 맞는 방이 없습니다.");
            }
            console.log(`${code} 방에 입장하셨씁니다`);
            console.log(doc.data().users);
            console.log("how many is", doc.data().how_many);                            //그냥 콘솔 확인하려구 찍어놓음. 지울 예정
            })
            .catch((error) => {
                return alert(error);
            })
    }
    return (
        <div className="background">  
            <div>
                <div>
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
                    <button className="login">
                        <form onSubmit={onLogin}>
                            <input type="text" name="name" placeholder="별명 입력.." onChange={(e) => setName(e.target.value)} className="login-input"/>
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
                                        <input type="text" name="code" placeholder="암호.." onChange={(e) => setCode(e.target.value)} className="enter">
                                        </input>
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