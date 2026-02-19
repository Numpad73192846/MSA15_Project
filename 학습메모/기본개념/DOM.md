```java
 DOM(Document Object Model)
1.한줄설명
 : HTML을 자바스크립트로 조작할 수 있게 만든 구조.
2. 자세한 설명
 : 브라우저가 HTML 파일을 읽으면 그냥 텍스트지만 DOM으로 변환하하면 각 태그가
  객체(Node)가 되고, 자바스크립트로 찾고, 바꾸고, 추가할 수 있게 됨.
3. 예시
 : 네이버 메인 뉴스 제목을 클릭하면 텍스트가 전부 바뀌는 것, 장바구니에 상품 추가하면
 숫자가 올라가는 것, 댓글 달면 화면에 뜨는 것 전부 DOM조작.

 예시코드
 ```html
 <h1 id="title">안녕하세요</h1>
 <button onclick="change()">클릭</button>
 ```

 ```javascript
 function change(){
    // DOM에서 id가 title인 요소를 찾아서 텍스트를 "반갑습니다"로 변경
    document.getElementById("title").innerText = "반갑습니다";

    // 텍스트 바꾸기
    h1.textContent = "변경됨!";

    // 색상 바꾸기
    h1. style.color = "red";

    // 크기 바꾸기
    h1.style.fontSize = "50px";
 }
 ```