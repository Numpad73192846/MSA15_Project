import React, { Component } from 'react'
import { useState } from 'react';

const FunctionComponent = () => {
    // state 선언
    // const [상태, 업데이트함수] = useState('초기값');
    const [name, setName] = useState('Aloha');

    // 이벤트 핸들러
    const handleClick = (newName) => {
        console.log(`${newName} Click!`);

        // 상태 업데이트
        setName(newName);
    }
    return (
        <div>
            <h1>함수형 컴포넌트</h1>
            <h2>Hello I'm {name}</h2>
            <button onClick={() => handleClick("Aloha")}>Aloha</button>
            <button onClick={() => handleClick("Joeun")}>Joeun</button>
        </div>
    )
}


export default FunctionComponent;
