```java
## HTTP 메서드와 REST API

REST API란?
REpresentational State Transfer(웹에서 자원을 URL로 표현하고, HTTP 메서드로 처리하는 API설계 방식)
API(Application Programming Interface, 프로그램간의 소통 규칙)
 - 웹에서 데이터를 주고받는 설계 방식/규칙
 - URL로 자원을 표현하고, HTTP 메서드로 행위를 표현
핵심원칙
1. 자원(Resource) 중심
 - URL은 자원을 표현해야 한다.
 - 예: /users, /products
2. HTTP 메서드 사용
 - HTTP 메서드로 행위를 표현해야 한다.
 - 예: GET, POST, PUT, DELETE
    1. GET: 조회
     GET /boards → 게시글 목록 전체
     GET /boards/1 → 게시글 1번 조회
     GET /boards?page=1&size=10 → 게시글 1페이지, 10개씩 조회
     특징: 데이터 변경 안 함, 안전함, 여러 번 호출해도 같은 결과
     데이터 전달: URL 파라미터(본문 없음)
     
     2. POST: 생성
     POST /boards
     본문: { "title": "제목", "content": "내용" }
     응답: 201 Created { "id": 1, "title": "제목", "content": "내용" }
     특징: 새로운 데이터 생성, 서버가 ID를 부여함, 데이터 전달: 요청본문에

     3. PUT: 수정
     PUT /boards/1
     본문: { "title": "수정된 제목", "content": "수정된 내용" }
     응답: 200 OK { "id": 1, "title": "수정된 제목", "content": "수정된 내용"}
     특징: 기존 데이터를 완전히 대체(덮어쓰기), 빠진 필드는 null이나 기본값으로 처리될 수 있음

     4. PATCH: 부분 수정
     PATCH /boards/1
     본문: { "title": "수정된 제목" }
     응답: 200 OK { "id": 1, "title": "수정된 제목", "content": "기존 내용"}
     특징: 보낸 필드값만 수정, 나머지 필드는 그대로 유지, PUT보다 실무에서 많이 쓰임

     5. DELETE: 삭제
     DELETE /boards/1
     응답: 204 No Content
     특징: 자원 삭제, 응답본문 없음

PUT 과 PATCH차이(중요!)
## 기존 데이터
{ "id": 1, "title": "제목", "content": "내용", "author": "조코딩" }

## PUT 요청시
PUT /boards/1
{ "title": "새제목" }
결과: { "id": 1, "title": "새제목", "content": null, "author": null }
→ 전체를 보낸 데이터로 덮어씀

## PATCH 요청시
PATCH /boards/1
{ "title": "새제목" }
결과: { "id":1, "title": "새제목", "content": "내용", "author": "김철수" }
→ 보낸 데이터만 수정

### RESTful URL 설계 원칙
** 좋은 예시
GET    /users       사용자 목록
GET    /users/123   123번 사용자 조회
POST   /users       사용자 생성
PUT    /users/123   123번 사용자 전체 수정
DELETE /users/123   123번 사용자 삭세

GET    /users/123/posts   123번 사용자의 게시글 목록
POST   /users/123/posts   123번 사용자가 게시글 작성

** 나쁜 예시
GET    /getUser?id=123   (X) 동사 사용
POST   /createUser       (X) 동사 사용
GET    /user/delete/123  (X) GET으로 삭제
POST   /user/123/update  (X) POST로 수정

** 실전 예시: 게시판 API
# 게시글 관련
GET    /boards
GET    /boards/1
POST   /boards
PATCH  /boards/1
DELETE /boards/1

# 댓글 관련 (계층 구조)
GET    /boards/1/comments     1번 게시글의 댓글 목록
POST   /boards/1/comments     1번 게시글에 댓글 작성
DELETE /boards/1/comments/5   5번 댓글 삭제

3. 상태 없음(Stateless)
 - 서버는 클라이언트의 상태를 저장하지 않는다.
 - 모든 요청은 독립적으로 처리되어야 한다.
4. 표현(Representation)
 - 자원은 표현(Representation) 형태로 전달된다.
 - 예: JSON, XML
5. URI로 자원 식별
 - 자원은 URI로 식별되어야 한다.
 - 예: /users/{id}
```