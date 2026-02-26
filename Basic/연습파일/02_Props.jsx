// =====================================================
// 02. Props 연습 (부모 → 자식 데이터 전달)
// =====================================================
// Props = Properties (속성)
// 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법
// Java로 비유하면: 생성자 매개변수 같은 것

import React from 'react';

// =====================================================
// 1. Props 기본 사용법
// =====================================================

// ① 자식 컴포넌트 (데이터를 받는 쪽)
//    매개변수 이름을 'props'로 쓰는 것이 관례
function GreetingCard(props) {
    return (
        <div>
            <h2>안녕하세요, {props.name}님!</h2>
            <p>나이: {props.age}세</p>
            <p>직업: {props.job}</p>
        </div>
    );
}

// ② 구조분해할당(Destructuring)으로 더 깔끔하게
//    props.name 대신 바로 { name } 으로 사용 가능
function GreetingCardV2({ name, age, job }) {
    return (
        <div>
            <h2>안녕하세요, {name}님!</h2>
            <p>나이: {age}세</p>
            <p>직업: {job}</p>
        </div>
    );
}

// ③ Props 기본값 설정 (defaultProps)
//    부모가 값을 안 보내줄 때 사용할 기본값
function Greeting({ name = '익명', age = 0 }) {
    return <p>{name} ({age}세)</p>;
}

// =====================================================
// 2. Props로 배열/객체 전달하기
// =====================================================
function ProductCard({ product }) {
    return (
        <div>
            <h3>{product.title}</h3>
            <p>가격: {product.price.toLocaleString()}원</p>  {/* 천단위 쉼표 */}
            <p>재고: {product.stock > 0 ? '있음' : '없음'}</p>
        </div>
    );
}

// =====================================================
// 3. Props로 함수 전달하기 (콜백)
// =====================================================
// 자식에서 부모의 함수를 호출하는 방법 (이벤트 올리기)
function Button({ label, onClick }) {
    return (
        <button onClick={onClick}>
            {label}
        </button>
    );
}

// =====================================================
// 4. children Props - 태그 사이 내용 전달
// =====================================================
function Card({ title, children }) {
    return (
        <div style={{ border: '1px solid gray', padding: '10px' }}>
            <h3>{title}</h3>
            {/* children = 부모가 태그 사이에 넣어준 내용 */}
            {children}
        </div>
    );
}

// =====================================================
// 5. 부모 컴포넌트 - 위에서 만든 자식들을 사용
// =====================================================
function App() {
    // 함수 정의
    const handleClick = () => {
        alert('버튼이 클릭되었습니다!');
    };

    // 객체 데이터
    const myProduct = {
        title: '맥북 프로',
        price: 2500000,
        stock: 3,
    };

    return (
        <div>
            <h1>Props 연습</h1>

            {/* Props 전달 방법: 속성처럼 작성 */}
            <GreetingCard name="홍길동" age={25} job="개발자" />

            {/* 구조분해 버전 */}
            <GreetingCardV2 name="김영희" age={30} job="디자이너" />

            {/* 기본값 테스트 - name만 보내고 age는 생략 */}
            <Greeting name="이철수" />
            <Greeting />     {/* 둘 다 생략 → 기본값 사용 */}

            {/* 객체 전달 */}
            <ProductCard product={myProduct} />

            {/* 함수 전달 */}
            <Button label="클릭하세요" onClick={handleClick} />

            {/* children 사용 */}
            <Card title="공지사항">
                <p>오늘은 화요일입니다.</p>
                <p>점심은 비빔밥입니다.</p>
            </Card>
        </div>
    );
}

export default App;
