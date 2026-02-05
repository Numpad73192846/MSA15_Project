## API(Application Programming Interface)
쉬운표현: API는**서로 다른 프로그램들**이 맞물려 돌아가게 해주는 연결고리
- 뜻: 서로 다른 소프트웨어 프로그램들이 **서로 소통**하고 **데이터를 주고받을**수 있게 해주는 매게체이자 약속
- 예시: 구글 맵 API, 트위터 API, 날씨 API 등

## REST(Representational State Transfer)
- 자원을 이름으로 구분하여 해당 자원의 상태(정보)를 주고받는 모든 것
- HTTP 메서드로 무엇을 할지 정함: GET(조회), POST(생성), PUT(수정), DELETE(삭제)

## RESTful and NON-RESTful
- 뜻: REST 아키텍처의 원칙을 성실하게 지킨 시스템이나 서비스를 의미함
- 핵심: 주소와 메서드만 보고도 그 자원이 무엇인지, 어떤 행위를 할 수 있는지 쉽게 알 수 있도록 설계하는 것
- 좋은 예시: `GET /products/1`, `PUT /products/1`

## Request (HTTP 요청)
- 클라이언트(브라우저)가 서버로 보내는 요청 메시지
- GET 요청: 서버로부터 데이터를 조회할 때 사용
- POST 요청: 서버에 데이터를 생성하거나 제출할 때 사용
- PUT 요청: 서버의 기존 데이터를 수정할 때 사용

## 포스트맨(Postman)을 사용하는 이유
1. 응답 상태 코드(HTTP Status Code) 확인 (200, 404, 500 등)
2. 응답 데이터(Response Body) 확인 (JSON, XML 등)
3. 헤더(Header) 설정 및 확인
4. 엔드포인트 및 로직 검증 (@Controller URL 동작 확인)
