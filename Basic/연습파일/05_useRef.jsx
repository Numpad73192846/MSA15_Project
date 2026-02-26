// =====================================================
// 05. useRef 연습 (DOM 직접 접근 + 렌더링 없는 값 저장)
// =====================================================
// useRef = 두 가지 용도로 사용
//   ① DOM 요소에 직접 접근 (getElementById 대체)
//   ② 렌더링을 일으키지 않는 값 저장 (이전 값 기억 등)
//
// 문법: const 변수명 = useRef(초기값);
//        변수명.current → 현재 값에 접근

import { useState, useRef, useEffect } from 'react';

// =====================================================
// 1. DOM 요소 직접 접근 (가장 많이 쓰는 패턴)
// =====================================================
function FocusInput() {
    // inputRef.current → input DOM 요소 자체를 가리킴
    const inputRef = useRef(null);

    const handleClick = () => {
        // DOM의 focus() 메서드를 직접 호출
        inputRef.current.focus();
    };

    const handleAlert = () => {
        // DOM의 value에 직접 접근
        alert('입력값: ' + inputRef.current.value);
    };

    return (
        <div>
            <h2>useRef - DOM 접근</h2>

            {/* ref 속성으로 inputRef와 이 input을 연결 */}
            <input ref={inputRef} type="text" placeholder="입력하세요" />

            <button onClick={handleClick}>🔍 포커스 이동</button>
            <button onClick={handleAlert}>📋 값 가져오기</button>
        </div>
    );
}

// =====================================================
// 2. 마운트 시 자동 포커스
// =====================================================
function AutoFocus() {
    const inputRef = useRef(null);

    // 컴포넌트가 화면에 나타나자마자 자동으로 포커스
    useEffect(() => {
        inputRef.current.focus();
    }, []);   // 빈 배열 → 마운트 시 1번

    return (
        <div>
            <h2>자동 포커스</h2>
            <input ref={inputRef} placeholder="페이지 열리면 자동 포커스!" />
        </div>
    );
}

// =====================================================
// 3. 렌더링 없이 값 저장 (이전 값 기억)
// =====================================================
// ★ 일반 변수(let, const)는 렌더링 시 초기화됨
//   useRef는 렌더링이 되어도 값을 유지함
//   하지만 값이 바뀌어도 화면을 다시 그리지 않음!
function PreviousValue() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef(0); // 이전 count 값 저장용

    useEffect(() => {
        // count가 바뀐 후에 이전 값을 ref에 저장
        prevCountRef.current = count;
    });

    return (
        <div>
            <h2>이전 값 기억하기</h2>
            <p>현재 count: {count}</p>
            <p>이전 count: {prevCountRef.current}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    );
}

// =====================================================
// 4. 렌더링 횟수 세기 (렌더링 없이 카운트)
// =====================================================
function RenderCounter() {
    const [text, setText] = useState('');
    const renderCount = useRef(0); // 렌더링 횟수는 state가 아닌 ref로!

    // 렌더링될 때마다 ref 값 증가 (state와 달리 재렌더링 유발 안 함)
    renderCount.current += 1;

    return (
        <div>
            <h2>렌더링 횟수 카운터</h2>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="입력하면 렌더링됨"
            />
            <p>렌더링 횟수: {renderCount.current}번</p>
            <p>
                💡 만약 renderCount를 useState로 만들었다면?<br />
                → count 바꿀 때마다 렌더링 → 렌더링이 렌더링을 부르는 무한루프!
            </p>
        </div>
    );
}

// =====================================================
// 5. 타이머 제어 (clearInterval 용도로 ref 사용)
// =====================================================
function StopwatchWithRef() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null); // interval ID 저장

    const start = () => {
        if (running) return;
        setRunning(true);
        // setInterval의 반환값(ID)을 ref에 저장
        intervalRef.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
    };

    const stop = () => {
        clearInterval(intervalRef.current); // ref에서 ID 꺼내서 취소
        setRunning(false);
    };

    const reset = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
        setTime(0);
    };

    return (
        <div>
            <h2>스톱워치</h2>
            <p style={{ fontSize: '2rem' }}>{time}초</p>
            <button onClick={start} disabled={running}>▶ 시작</button>
            <button onClick={stop} disabled={!running}>⏸ 정지</button>
            <button onClick={reset}>🔄 초기화</button>
        </div>
    );
}

// =====================================================
// 전체 묶음
// =====================================================
function App() {
    return (
        <div>
            <h1>useRef 연습</h1>
            <hr />
            <FocusInput />
            <hr />
            <AutoFocus />
            <hr />
            <PreviousValue />
            <hr />
            <RenderCounter />
            <hr />
            <StopwatchWithRef />
        </div>
    );
}

export default App;
