```jsx
## HOOK이란?
HOO은 함수형 컴포넌트에서 React의 기능을 사용할 수 있게 해주는 함수.
항상 'use'로 시작함

1. useState: 상태관리
const [count, setCount ] = useState(0)
- count: 현재 값
- setCount: 값 변경 함수
- useState(0): 초기 값

2. useEffect: 사이드 이펙트 처리
useEffect(() => {
    // 컴포넌트가 렌더링될 때 실행
    console.log("마운트됨")

    return () => {
        // 컴포넌트가 사라질 때 실행 (cleanup)
    }
})

3. useContext: 전역상태 공유
const user = useContext(UserContext)