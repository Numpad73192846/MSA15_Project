```JAVA
AJAX란?(Asynchronous JavaScript and XML)비동기 자바스크립트와 XML
한마디로 페이지 새로고침 없이 서버와 데이터를 주고받는 기술이다.

예: 유튜브 무한스크롤, 인스타그램 좋아요 하면 바로 +1을 요청서버에 보내고 화면에 +1을 표시한다.
회원가입 아이디 중복확인 버튼 등...

JavaScript 코드로 보자
1. fetch 기본구조(GET)
코드:
fetch('/api/posts/')
    .then(function(response) {
        return response.json();
        // 해석: .then()은 응답을 받으면 실행되는 함수이다.
        // (function(response){})는 응답을 받으면 실행되는 함수이다.
        // return response.json(); 응답을 JSON으로 변환한다.
    })
    .then(function(data) {
        console.log(data);
        // 해석: .then()은 응답을 받으면 실행되는 함수이다.
        // (function(data){})는 응답을 받으면 실행되는 함수이다.
        // console.log(data); 데이터를 콘솔에 출력한다.
    })
    .catch(function(error) {
        console.log('에러:', error);
        // 해석: .catch()는 에러를 받으면 실행되는 함수이다.
        // (function(error){})는 에러를 받으면 실행되는 함수이다.
        // console.log('에러:', error); 에러를 콘솔에 출력한다.
    })

2. fetch로 데이터 보내기(POST)
// 서버에 새 게시글 등록하기
fetch('api/posts/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    // fetch는 기본적으로 GET방식으로 데이터를 보낸다.
    // method: POST방식으로 데이터를 보낸다.
    // headers: JSON 형식으로 데이터를 보낸다.
    },
    body: JSON.stringify({
        title: '오늘의 일기',
        content: 'AJAX 학습을 했다'
        // JSON.stringify(): JavaScript 객체를 JSON 문자열로 변환한다.
        // body: JSON 형식으로 데이터를 보낸다.
    })
})
    .then(function(response) {
        return response.json();
        // .then(): 응답을 받으면 실행되는 함수이다.
        // (function(response){})는 응답을 받으면 실행되는 함수이다.
        // return response.json(); 응답을 JSON형식으로 변환한다.
    })
    .then(function(data) {
        alert('게시글이 등록되었습니다!');
        // .then(): 응답을 받으면 실행되는 함수이다.
        // (function(data){})는 응답을 받으면 실행되는 함수이다.
        // alert('게시글이 등록되었습니다!'); 게시글이 등록되었습니다!를 알림창에 표시한다.
    })
    .catch(function(error) {
        console.log('에러:', error);
        // .catch(): 에러를 받으면 실행되는 함수이다.
        // (function(error){})는 에러를 받으면 실행되는 함수이다.
        // console.log('에러:', error); 에러를 콘솔에 출력한다.
    })

3. async/await 버전(동일 코드, 가독성 좋음)
코드:
async function createPost() {
    try {
        const response = await fetch('api/posts/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: '오늘의 일기',
              content: 'AJAX 학습을 했다'
            })
        });
        const data = await response.json();
        alert('게시글이 등록 되었습니다!');
        // await: 기다리다 response를 비동기 작업의 결과가 돌아올 때까지 현재 함수 실행을 멈추고 기다린다.
    } catch (error) {
       alert('서버 연결에 실패했습니다.'); 
    }
}
    // const의 풀네임: constant는 상수
```