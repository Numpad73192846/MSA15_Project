// =====================================================
// 06. 종합 실습 - 미니 Todo 앱
// =====================================================
// 지금까지 배운 내용을 모두 활용한 실전 예제
//
// 사용 기술:
//   ✅ useState  - 상태 관리 (todo 목록, 입력값, 필터)
//   ✅ useEffect - localStorage 연동 (새로고침해도 유지)
//   ✅ useRef    - 입력창 자동 포커스
//   ✅ Props     - 부모→자식 데이터 전달
//   ✅ 이벤트    - onClick, onChange, onKeyDown
//   ✅ 조건부 렌더링 - 삼항연산자, &&
//   ✅ map/filter - 배열 렌더링, 필터링

import { useState, useEffect, useRef } from 'react';

// =====================================================
// 자식 컴포넌트 ①: 입력창
// =====================================================
function TodoInput({ onAdd }) {   // onAdd: 부모에서 받은 함수(Props)
    const [text, setText] = useState('');
    const inputRef = useRef(null);  // 자동 포커스용

    // 마운트 시 자동 포커스
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleAdd = () => {
        if (text.trim() === '') return;  // 공백 방지

        onAdd(text);   // ★ 부모에게 입력값 전달 (콜백 Props)
        setText('');   // 입력창 초기화
        inputRef.current.focus();
    };

    // Enter 키로도 추가
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="할 일을 입력하고 Enter!"
                style={{ flex: 1, padding: '8px' }}
            />
            <button onClick={handleAdd}>추가</button>
        </div>
    );
}

// =====================================================
// 자식 컴포넌트 ②: 할 일 항목 하나
// =====================================================
function TodoItem({ todo, onToggle, onDelete }) {
    // Props 구조분해:
    //   todo   = { id, text, done }
    //   onToggle = 완료 토글 함수
    //   onDelete = 삭제 함수
    return (
        <li
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
                // 완료된 항목은 회색 + 취소선
                color: todo.done ? '#aaa' : '#000',
                textDecoration: todo.done ? 'line-through' : 'none',
            }}
        >
            {/* 체크박스: 클릭 시 완료 토글 */}
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
            />

            {/* 할 일 텍스트 */}
            <span style={{ flex: 1 }}>{todo.text}</span>

            {/* 삭제 버튼 */}
            <button onClick={() => onDelete(todo.id)}>🗑</button>
        </li>
    );
}

// =====================================================
// 자식 컴포넌트 ③: 필터 버튼 (전체/진행중/완료)
// =====================================================
function Filterbuttons({ currentFilter, onFilterChange }) {
    const filters = ['전체', '진행중', '완료'];

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    style={{
                        // 선택된 필터는 진하게 표시
                        fontWeight: currentFilter === filter ? 'bold' : 'normal',
                        background: currentFilter === filter ? '#007bff' : '#ddd',
                        color: currentFilter === filter ? '#fff' : '#000',
                        padding: '4px 12px',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                    }}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}

// =====================================================
// 부모 컴포넌트 (메인)
// =====================================================
function App() {
    // ① 상태 정의
    const [todos, setTodos] = useState([]);         // 전체 할 일 목록
    const [filter, setFilter] = useState('전체');    // 현재 필터

    // ② localStorage에서 데이터 불러오기 (마운트 시 1번)
    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            setTodos(JSON.parse(saved));  // JSON 문자열 → 배열로 변환
        }
    }, []);

    // ③ todos가 바뀔 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
        //                                ↑ 배열 → JSON 문자열로 변환
    }, [todos]);

    // =====================================================
    // 이벤트 핸들러
    // =====================================================

    // 추가
    const handleAdd = (text) => {
        const newTodo = {
            id: Date.now(),  // 현재 시각을 ID로 사용 (간단한 고유값)
            text: text,
            done: false,
        };
        setTodos([...todos, newTodo]);
    };

    // 완료 토글
    const handleToggle = (id) => {
        setTodos(todos.map((todo) =>
            todo.id === id
                ? { ...todo, done: !todo.done }  // 해당 항목의 done만 반전
                : todo                            // 나머지는 그대로
        ));
    };

    // 삭제
    const handleDelete = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // 전체 삭제
    const handleDeleteAll = () => {
        if (window.confirm('전체 삭제하시겠습니까?')) {
            setTodos([]);
        }
    };

    // =====================================================
    // 필터 적용 (화면에 보여줄 목록 계산)
    // =====================================================
    const filteredTodos = todos.filter((todo) => {
        if (filter === '진행중') return !todo.done;   // 완료 안 된 것만
        if (filter === '완료') return todo.done;    // 완료된 것만
        return true;                                  // 전체
    });

    // 통계 계산
    const totalCount = todos.length;
    const doneCount = todos.filter((t) => t.done).length;
    const leftCount = totalCount - doneCount;

    // =====================================================
    // 화면 렌더링
    // =====================================================
    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 16px' }}>
            <h1>📝 나의 할 일 목록</h1>

            {/* 통계 */}
            <p>전체: {totalCount}개 | 완료: {doneCount}개 | 남은 것: {leftCount}개</p>

            {/* 입력창 - onAdd Props로 함수 전달 */}
            <TodoInput onAdd={handleAdd} />

            {/* 필터 버튼 */}
            <FilterButtons
                currentFilter={filter}
                onFilterChange={setFilter}
            />

            {/* 할 일 목록 */}
            {/* 조건부 렌더링: 목록이 비었을 때만 메세지 표시 */}
            {filteredTodos.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>
                    {filter === '전체' ? '할 일을 추가해보세요!' : '해당 항목이 없습니다.'}
                </p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}

            {/* 전체 삭제 버튼 - 항목이 있을 때만 표시 (&&) */}
            {todos.length > 0 && (
                <button
                    onClick={handleDeleteAll}
                    style={{ color: 'red', marginTop: '16px' }}
                >
                    전체 삭제
                </button>
            )}
        </div>
    );
}

export default App;
