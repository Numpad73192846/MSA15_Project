// =====================================================
// 03. useState 연습 (상태 관리)
// =====================================================
// useState = 컴포넌트 안의 데이터를 기억하고 바꾸는 Hook
// state가 바뀌면 → 컴포넌트가 자동으로 다시 렌더링됨!
//
// 문법: const [값, 변경함수] = useState(초기값);
//        ↑ 현재값    ↑ setter

import { useState } from 'react';

// =====================================================
// 1. 숫자 상태 - 카운터
// =====================================================
function Counter() {
    // count: 현재 숫자값
    // setCount: count를 바꾸는 함수
    // useState(0): 초기값 0으로 시작
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>카운터</h2>
            <p>현재 값: {count}</p>

            {/* 버튼 클릭 시 setCount 호출 */}
            <button onClick={() => setCount(count + 1)}>+1 증가</button>
            <button onClick={() => setCount(count - 1)}>-1 감소</button>
            <button onClick={() => setCount(0)}>초기화</button>
        </div>
    );
}

// =====================================================
// 2. 문자 상태 - 입력창
// =====================================================
function InputBox() {
    const [text, setText] = useState('');  // 빈 문자열로 시작

    return (
        <div>
            <h2>입력창</h2>
            {/* onChange: 입력값이 바뀔 때마다 이벤트 발생 */}
            {/* e.target.value: 현재 입력창의 값 */}
            <input
                type="text"
                value={text}                              // 상태와 입력창 연결
                onChange={(e) => setText(e.target.value)} // 입력 시 상태 업데이트
                placeholder="여기에 입력하세요"
            />
            <p>입력한 내용: {text}</p>
            <p>글자 수: {text.length}자</p>
            <button onClick={() => setText('')}>지우기</button>
        </div>
    );
}

// =====================================================
// 3. 불리언 상태 - 토글
// =====================================================
function Toggle() {
    const [isOn, setIsOn] = useState(false);  // false로 시작

    return (
        <div>
            <h2>토글 스위치</h2>
            <p>현재 상태: {isOn ? '켜짐 🟢' : '꺼짐 🔴'}</p>

            {/* prev: 이전 상태값 → 안전하게 반전 */}
            <button onClick={() => setIsOn(prev => !prev)}>
                {isOn ? '끄기' : '켜기'}
            </button>
        </div>
    );
}

// =====================================================
// 4. 객체 상태
// =====================================================
function UserForm() {
    // 상태를 객체로 관리
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: '',
    });

    // 객체 상태 업데이트: 스프레드 연산자(...)로 기존값 유지 후 일부만 변경
    const handleChange = (e) => {
        const { name, value } = e.target;  // input의 name속성과 value를 가져옴
        setUser({
            ...user,        // 기존 user 객체의 모든 값을 복사
            [name]: value,  // 해당 필드만 새 값으로 교체
        });
    };

    return (
        <div>
            <h2>회원가입 폼</h2>
            <input
                type="text"
                name="name"           // name 속성이 handleChange에서 사용됨
                value={user.name}
                onChange={handleChange}
                placeholder="이름"
            />
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="이메일"
            />
            <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                placeholder="나이"
            />

            <h3>입력된 정보:</h3>
            <p>이름: {user.name}</p>
            <p>이메일: {user.email}</p>
            <p>나이: {user.age}</p>
        </div>
    );
}

// =====================================================
// 5. 배열 상태 - 리스트 추가/삭제
// =====================================================
function TodoList() {
    const [todos, setTodos] = useState(['공부하기', '운동하기']);
    const [input, setInput] = useState('');

    // 추가
    const addTodo = () => {
        if (input.trim() === '') return;          // 빈 값 방지
        setTodos([...todos, input]);              // 기존 배열 + 새 항목
        setInput('');                             // 입력창 초기화
    };

    // 삭제 (index로 해당 항목 제거)
    const deleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
        //               ↑ 클릭한 index가 아닌 것들만 남김
    };

    return (
        <div>
            <h2>할 일 목록</h2>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="할 일 입력"
            />
            <button onClick={addTodo}>추가</button>

            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button onClick={() => deleteTodo(index)}>삭제</button>
                    </li>
                ))}
            </ul>
            <p>총 {todos.length}개</p>
        </div>
    );
}

// =====================================================
// 전체를 묶어서 export
// =====================================================
function App() {
    return (
        <div>
            <h1>useState 연습</h1>
            <hr />
            <Counter />
            <hr />
            <InputBox />
            <hr />
            <Toggle />
            <hr />
            <UserForm />
            <hr />
            <TodoList />
        </div>
    );
}

export default App;
