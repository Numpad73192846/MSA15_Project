## @Entity (JPA 엔티티) 상세 정리

### 핵심 어노테이션
- **@Entity**: 자바 객체와 DB 테이블을 이어주는 다리 역할. 이 클래스가 JPA 엔티티임을 명시.
- **@Table(name = "Board")**: 엔티티가 매핑될 테이블 이름을 명시. 클래스명과 테이블명이 다를 때 유용.
- **@Id**: PK(기본키)를 지정. 데이터의 고유 식별자.
- **@GeneratedValue(strategy = GenerationType.IDENTITY)**: DB가 번호를 자동으로 매겨줌 (Auto Increment).
- **@Column**: 컬럼의 제약 조건(nullable, length, definition 등)을 설정.

### 감사(Auditing) 기능
- **@EntityListeners(AuditingEntityListener.class)**: 엔티티 생성/수정 시간을 자동 기록하기 위한 리스너.
- **@CreatedDate / @LastModifiedDate**: 생성일자와 수정일자 자동 관리.

### 필드 및 메서드
- **@Builder**: 빌더 패턴을 사용하여 객체 생성을 유연하게 함.
- **updateBoard()**: 서비스 계층에서 엔티티의 상태를 변경하여 DB에 반영(더티 체킹 등).
