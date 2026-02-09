조별과제 코드 복기
```java

import java.util.Date;
// Date 클래스 임포트, 자바에서 제공하는 날짜와 시간을 다루는 클래스
import lombok.Data;

@Data
// Getter, Setter, ToString, EqueslsAndHashCode, RequeiredArgsConstructor 등을 자동으로 생성해주는 Lombok 어노테이션

public class TutorDocument {
// TutorDocument 클래스 선언

    private Long no;
    private String userId;
    private String id;
    private String docType;
    private int fileSize;
    private String reviewdBy;
    private Date reviewdAt;
    private String rejectReason;
    private String originalName;
    private String storeName;
    private String filePath;
    private String contentType;
    private Date createdAt;
    private Date updatedAt;

    private String userName;
}