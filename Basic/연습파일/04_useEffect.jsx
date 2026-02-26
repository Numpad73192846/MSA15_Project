// =====================================================
// 04. useEffect 연습 (사이드 이펙트 처리)
// =====================================================
// useEffect = 렌더링 이후에 실행되는 코드
// 주로 사용하는 곳:
//   ① API 호출 (서버에서 데이터 가져오기)
//   ② 타이머 설정 (setTimeout, setInterval)
//   ③ 이벤트 리스너 등록/해제
//
// 문법:
//   useEffect(() => {
//     // 실행할 코드
//     return () => { /* cleanup (뒷정리) */ }
//   }, [의존성배열]);

import { useState, useEffect } from 'react';

// =====================================================
// 1. 의존성 배열에 따른 실행 시점
// =====================================================
function EffectTiming() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');

    // ① 의존성 배열 없음 → 매 렌더링마다 실행 (별로 안 씀)
    useEffect(() => {
        console.log('① 매 렌더링마다 실행됨');
    });

    // ② 빈 배열 [] → 최초 1번만 실행 (마운트)
    //    Java의 @PostConstruct 같은 느낌
    useEffect(() => {
        console.log('② 컴포넌트가 처음 화면에 나타날 때 1번 실행');
    }, []);   // ← 빈 배열!

    // ③ 배열 안에 값 → 해당 값이 바뀔 때만 실행
    useEffect(() => {
        console.log('③ count가 바뀔 때만 실행:', count);
    }, [count]);   // ← count가 변경될 때만

    useEffect(() => {
        console.log('③ name이 바뀔 때만 실행:', name);
    }, [name]);

    return (
        <div>
            <h2>useEffect 실행 시점</h2>
            <p>count: {count}</p>
            <button onClick={() => setCount(count + 1)}>count 증가</button>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 입력"
            />
            <p>개발자 도구 콘솔(F12)을 확인하세요!</p>
        </div>
    );
}

// =====================================================
// 2. Cleanup (뒷정리 함수)
// =====================================================
// useEffect가 return 하는 함수 = cleanup
// 컴포넌트가 사라질 때(언마운트) 또는 effect 재실행 전에 호출
function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) return;  // 실행 중이 아니면 아무것도 안 함

        // 1초마다 seconds를 1 증가
        const intervalId = setInterval(() => {
            setSeconds(prev => prev + 1);  // prev: 이전 상태값 사용 (안전)
        }, 1000);

        // ★ cleanup: 컴포넌트가 사라지거나 isRunning이 바뀌기 전에 실행
        //    인터벌을 제거하지 않으면 메모리 누수 발생!
        return () => {
            clearInterval(intervalId);
            console.log('인터벌 정리됨');
        };
    }, [isRunning]);  // isRunning이 바뀔 때마다 effect 재실행

    return (
        <div>
            <h2>타이머</h2>
            <p>{seconds}초</p>
            <button onClick={() => setIsRunning(true)}>시작</button>
            <button onClick={() => setIsRunning(false)}>정지</button>
            <button onClick={() => { setIsRunning(false); setSeconds(0); }}>초기화</button>
        </div>
    );
}

// =====================================================
// 3. API 호출 (서버에서 데이터 가져오기)
// =====================================================
// 실제 프로젝트에서 가장 많이 쓰는 패턴!
// JSONPlaceholder = 연습용 무료 가짜 API
function UserList() {
    const [users, setUsers] = useState([]);    // 유저 목록
    const [loading, setLoading] = useState(true);  // 로딩 중 여부
    const [error, setError] = useState(null);  // 에러 메세지

    // 마운트 시 API 호출
    useEffect(() => {
        // async 함수를 useEffect 안에서 쓸 때는 내부에 선언 후 호출
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/users'
                );

                if (!response.ok) {
                    throw new Error('서버 오류: ' + response.status);
                }

                const data = await response.json();  // JSON 파싱
                setUsers(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);  // 성공/실패 상관없이 로딩 끝
            }
        };

        fetchUsers();  // 함수 호출
    }, []);  // ← 빈 배열: 마운트 시 1번만 실행

    // 로딩 중 화면
    if (loading) return <p>⏳ 불러오는 중...</p>;

    // 에러 화면
    if (error) return <p>❌ 오류: {error}</p>;

    // 성공 화면
    return (
        <div>
            <h2>유저 목록 (API 연동)</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>{user.name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// =====================================================
// 4. 검색어 바뀔 때마다 API 호출 (의존성 활용)
// =====================================================
function PostSearch() {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 검색어가 없으면 호출 안 함
        if (query.trim() === '') {
            setPosts([]);
            return;
        }

        setLoading(true);

        const fetchPosts = async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await res.json();

            // 제목에 검색어가 포함된 것만 필터링
            const filtered = data.filter((post) =>
                post.title.includes(query)
            );
            setPosts(filtered.slice(0, 5));  // 최대 5개만
            setLoading(false);
        };

        fetchPosts();

    }, [query]);  // ← query가 바뀔 때마다 API 재호출

    return (
        <div>
            <h2>게시글 검색</h2>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어 입력 (영어)"
            />
            {loading && <p>검색 중...</p>}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

// =====================================================
// 전체 묶음
// =====================================================
function App() {
    return (
        <div>
            <h1>useEffect 연습</h1>
            <hr />
            <EffectTiming />
            <hr />
            <Timer />
            <hr />
            <UserList />
            <hr />
            <PostSearch />
        </div>
    );
}

export default App;
