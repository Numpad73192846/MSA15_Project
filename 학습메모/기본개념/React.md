```jsx
React란? 
1. 컴포넌트 기반
: React 애플리케이션은 작고 재사용 가능한 컴포넌트로 구성됩니다.
 각 컴포넌트는 자체적으로 상태(state)를 가질 수 있으며,
 이러한 컴포넌트를 조합하여 전체 애플리케이션을 구축합니다.

2. 가상 DOM (Virtual DOM)
: React는 가상 DOM을 사용하여 브라우저에 렌더링되기 전에 가상으로 모든 변경 사항을 처리합니다. 이를 통해 효율적으로 화면을 갱신하고 성능을 최적화할 수 있습니다.

3. JSX (JavaScript XML)
: React에서는 JSX라는 문법을 사용하여 JavaScript 코드 안에서 XML과 유사한 문법으로 UI를 작성할 수 있습니다. JSX는 간결하고 가독성이 높은 코드를 작성할 수 있도록 도와줍니다.

4. 단방향 데이터 바인딩
: React는 단방향 데이터 바인딩을 지원하여 데이터의 흐름이 단일 방향으로 유지됩니다. 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달할 수 있으나, 그 반대는 자동으로 이루어지지 않습니다.

주요 학습 요소
1. JSX
:HTML처럼 생긴 자바스크립트 문법.
브라우저가 이해할 수 있게 내부적으로 자바 스크립트로 변환.
    예시 코드
    // 아래가 JSX
    const element = <h1>Hello, world!</h1>;

    // 실제로 브라우저가 이해하는 자바스크립트 코드
    const element = React.createElement('h1', null, 'Hello, world!');

    // 중괄호 {} 안에 자바스크립트 표현식을 넣을 수 있음.
    const name = "홍길동";
    const element = <h1>Hello, {name}</h1>;

2. 컴포넌트
:컴포넌트는 재사용 가능한 UI 조각입니다.
 함수형 컴포넌트와 클래스형 컴포넌트가 있습니다.
    예시 코드
    // 함수형 컴포넌트
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
    }

    // 클래스형 컴포넌트
    class Welcome extends React.Component {
        render() {
            return <h1>Hello, {this.props.name}</h1>;
        }
    }

3. Props
    Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 데 사용됩니다.

4. State
:컴포넌트 내부의 변경 가능한 데이터. State가 바뀌면 화면이 자동으로 다시 렌더링.
 Java로 비유하면 private 필드, setter 호출하면 화면이 자동으로 갱신되는 느낌.
    예시코드
    import { useState } from 'react';

    function Counter() {
    const [count, setCount] = useState(0); // 초기값 0
    return (
        <button onClick={() => setCount(count + 1)}>
            클릭 수: {count}
        </button>
    );
}

5. 라이프사이클(생명주기)

6. Hooks
함수형 컴포넌트에서 State, 라이프사이클 등을 쓸 수 있게 해주는 함수.
use로 시작함
예시 코드
import { useState } from 'react';

function Counter() {
    const [user, setUser] = useState(null);

    // Mount 시 실행 (Java의 @PostConstruct 같은 느낌)
    useEffect(() => {
        fetch
    })
}

7. 이벤트 핸들링

8. 조건부 렌더링
```