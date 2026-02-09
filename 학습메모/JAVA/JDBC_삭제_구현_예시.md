## JDBC 삭제(Delete) 로직 구현 예시

```java
public int delete(String id) {
    int result = 0;
    String sql = "DELETE FROM `user` WHERE id = ? ";
    try {
        psmt = con.prepareStatement(sql); // 1. DB 연결 및 Query 준비
        psmt.setString(1, id);            // 2. 파라미터 바인딩 (?)
        
        result = psmt.executeUpdate();    // 3. 쿼리 실행 및 결과 반환
        
    } catch (Exception e) {
        e.printStackTrace();               // 4. 예외 발생 시 로그 출력
    } 
    return result;                         // 5. 처리 결과 반환 (삭제된 행 수)
}
```
- **executeUpdate()**: INSERT, UPDATE, DELETE 처럼 데이터가 바뀔 때 사용.
- **psmt.setXXX()**: SQL의 `?` 자리에 안전하게 값을 채워줌 (SQL Injection 방지).
