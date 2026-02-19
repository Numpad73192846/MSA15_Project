## 커스텀 예외 처리 (AppException)

### 구조 분석
- **extends RuntimeException**: 체크되지 않는 예외(Runtime Exception)로 상속받음.
- **final ErrorCode errorCode**: 프로젝트에서 정의한 에러 코드(상태 코드, 메시지 등)를 포함.

### 동작 원리
1. **생성자**: `ErrorCode`를 매개변수로 받아 `super(errorCode.getMessage())`를 통해 부모 클래스인 `RuntimeException`에 메시지를 전달.
2. **this.errorCode = errorCode**: 현재 객체에 에러 코드를 저장하여 나중에 핸들러에서 정보를 꺼내 쓸 수 있게 함.
