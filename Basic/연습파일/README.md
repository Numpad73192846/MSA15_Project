# 📚 React 연습 파일 목록

보고 따라치기 좋게 만든 React 학습 파일입니다.
각 파일을 순서대로 열고, 직접 타이핑해 보세요!

---

## 파일 순서

| 파일 | 주요 개념 | 난이도 |
|------|----------|--------|
| `01_JSX기초.jsx` | JSX 문법, 변수 출력, 조건/반복 | ⭐ |
| `02_Props.jsx` | 부모→자식 데이터 전달, children | ⭐⭐ |
| `03_useState.jsx` | 상태 관리 (숫자/문자/객체/배열) | ⭐⭐ |
| `04_useEffect.jsx` | 사이드이펙트, API 호출, 타이머 | ⭐⭐⭐ |
| `05_useRef.jsx` | DOM 접근, 렌더링 없는 값 저장 | ⭐⭐⭐ |
| `06_종합실습_TodoApp.jsx` | 모든 개념 종합 실전 앱 | ⭐⭐⭐⭐ |

---

## 핵심 개념 요약

### useState
```jsx
const [값, 변경함수] = useState(초기값);
// 값이 바뀌면 → 자동으로 화면 다시 그림
```

### useEffect
```jsx
useEffect(() => {
  // 실행 코드
  return () => { /* cleanup */ };
}, [의존성]);

// []       → 마운트 시 1번만
// [값]     → 값이 바뀔 때마다
// 없으면   → 매 렌더링마다
```

### useRef
```jsx
const ref = useRef(null);
<input ref={ref} />
ref.current.focus();   // DOM 직접 접근
```

### Props
```jsx
// 부모
<Child name="홍길동" onClick={handleClick} />

// 자식
function Child({ name, onClick }) {
  return <button onClick={onClick}>{name}</button>;
}
```

---

## 따라치기 팁 🖊️

1. 주석을 **먼저 읽고** 이해한 뒤 코드를 치세요
2. 다 치고 나면 **주석 없이** 혼자 다시 써보세요
3. `console.log()`를 활용해서 값이 어떻게 변하는지 확인하세요
4. 코드를 **바꿔보면서** 어떻게 동작이 달라지는지 실험해보세요
