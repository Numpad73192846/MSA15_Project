## 롬복(Lombok)
자바의 보일러 플레이트 코드(반복되는 Getter, Setter, 생성자 등)를 줄여주는 라이브러리.

### 주요 어노테이션
- **@Getter / @Setter**: 필드 값을 읽거나 수정하는 메서드 자동 생성.
- **@AllArgsConstructor**: 모든 필드를 매개변수로 받는 생성자 생성.
- **@NoArgsConstructor**: 매개변수가 없는 기본 생성자 생성.
- **@RequiredArgsConstructor**: **final**이나 **@NonNull** 필드만 포함하는 생성자를 생성. 
  - 스프링에서 의존성 주입(DI)을 생성자 주입 방식으로 할 때 매우 편리함.
- **@Data**: 위 항목들을 포함한 종합 패키지.

### 상세 비교: @RequiredArgsConstructor
```java
// [사용 전] 생성자를 직접 작성해야 함
public class BoardService {
    private final BoardRepository boardRepository;
    
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }
}

// [사용 후] 어노테이션 하나로 해결
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
}
```
