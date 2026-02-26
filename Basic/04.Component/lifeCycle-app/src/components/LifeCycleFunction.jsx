import React, { useState, useEffect, useRef, useMemo } from 'react';

const LifecycleFunction = (props) => {
    // constructor 대신 useState로 상태 초기화
    console.log('constructor: 컴포넌트가 생성 중입니다.');
    const [data, setData] = useState(null);
    const [count, setCount] = useState(0);
    const [otherValue, setOtherValue] = useState(0);

    // useMemo - 성능 최적화를 위한 메모이제이션 훅
    // - 첫 번째 인자: 메모이제이션할 값을 계산하는 함수
    // - 두 번째 인자: 의존성 배열 - 배열 내 값이 변경될 때만 재계산
    // - 의존성 배열의 값이 변하지 않으면 이전에 계산된 값을 재사용
    // - 복잡하거나 비용이 많이 드는 계산을 최적화할 때 사용
    // - 렌더링마다 실행되지 않아 불필요한 계산을 방지
    // 메모이제이션이란?
    // : 계산된 결과를 저장하여 동일한 입력에 대해 다시 계산하지 않고 저장된 결과를 반환하는 최적화 기법
    const expensiveCalculation = useMemo(() => {
        console.log('useMemo: 복잡한 계산을 수행 중...');
        // 복잡한 계산을 시뮬레이션 (count가 변경될 때만 실행)
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += count;
        }
        return result;
    }, [count]); // count가 변경될 때만 재계산, otherValue가 변해도 재계산 안 함

    // getDerivedStateFromProps - 렌더링 중에 처리
    console.log('getDerivedStateFromProps: nextProps와 prevState를 받습니다. 상태를 업데이트하려면 객체를 반환하고, 그렇지 않으면 null을 반환합니다.');

    // 이전 상태를 추적하기 위한 ref (componentDidUpdate용)
    const prevDataRef = useRef();

    // getSnapshotBeforeUpdate 대체 - DOM 업데이트 전 값 저장
    useEffect(() => {
        console.log('getSnapshotBeforeUpdate: 가상 DOM에서 실제 DOM으로 변경 사항이 반영되기 전에 호출됩니다.');
        prevDataRef.current = data;
    });

    // componentDidMount - 마운트 시 한 번만 실행
    useEffect(() => {
        console.log('componentDidMount: 컴포넌트가 DOM에 마운트되었습니다.');
        // 비동기 작업, 데이터 가져오기 등을 수행합니다.
        fetchData();

        // componentWillUnmount - cleanup 함수
        return () => {
            console.log('componentWillUnmount: 컴포넌트가 DOM에서 제거되기 전에 호출됩니다.');
        };
    }, []); // 빈 배열: 마운트/언마운트 시에만 실행

    // componentDidUpdate - data가 변경될 때마다 실행
    useEffect(() => {
        if (prevDataRef.current !== undefined) {
            console.log('componentDidUpdate: 컴포넌트가 DOM에서 업데이트된 후에 호출됩니다.');
        }
    }, [data]);

    // shouldComponentUpdate - React.memo로 대체 가능 (컴포넌트 외부에서)
    console.log('shouldComponentUpdate: 컴포넌트가 다시 렌더링되기 전에 호출됩니다. 불리언 값을 반환합니다.');

    const fetchData = () => {
        // 비동기 작업을 시뮬레이션합니다.
        setTimeout(() => {
            console.log('데이터를 성공적으로 가져왔습니다!');
            setData('가져온 데이터');
        }, 2000);
    };

    // render
    console.log('render: 컴포넌트를 렌더링 중입니다.');
    return (
        <div>
            <h1>컴포넌트 생명주기 예제</h1>
            <p>데이터: {data}</p>

            <hr />

            <h2>useMemo 예제</h2>
            <p>Count: {count}</p>
            <p>계산된 값 (useMemo): {expensiveCalculation}</p>
            <p>다른 값: {otherValue}</p>

            <button onClick={() => setCount(count + 1)}>
                Count 증가 (useMemo 재계산)
            </button>
            <button onClick={() => setOtherValue(otherValue + 1)}>
                다른 값 증가 (useMemo 재계산 안 함)
            </button>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                💡 "다른 값 증가" 버튼을 클릭해도 useMemo는 재계산되지 않습니다. (콘솔 확인)
            </p>
        </div>
    );
};

export default LifecycleFunction;