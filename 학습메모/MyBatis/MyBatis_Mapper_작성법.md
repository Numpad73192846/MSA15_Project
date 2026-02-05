```java
AdmainMapper.java
package com.aloha.teamproject.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
// Java와 MyBatis를 연결해주는 어노테이션
import org.apache.ibatis.annotations.Param;
// @Param: Mybatis 어노테이션, 매개변수 이름을 SQL에 명시적으로 전달
// 예: XML에서 #{변수명} 형태로 사용할 때 이름을 매칭시켜줌
import com.aloha.teamproject.dto.TutorDocument;
import com.aloha.teamproject.dto.TutorSettlement;

@Mapper
// @Mapper어노테이션: Mybatis에게 이 인터페이스가 SQL Mapper라고 알림
/** 역할:
 * 1. 스프링이 이 인터페이스를 자동으로 스캔해서 Bean으로 등록
 * 2. XML 파일과 자동으로 연결(namespace 기준)
 * 3. 인터페이스만 만들면 구현체는 Mybatis가 자동으로 생성
 */

public interface AdminMapper {
    // public interface: 인터페이스 선언
    List<TutorDocument> selectPendingDocuments();
    // List<TutorDocument> = 반환타입,
    // selectPendingDocuments(): 메서드 이름, 대기중인 문서 목록 조회
    // 역할: 검토 대기중인 튜터 문서 목록을 데이터베이스에서 조회
    void updateDocumentStatus(
        // void: 아무것도 반환하지 않음(Update문에는 주로 반환값 없음)
        @Param("id") String id,
        // @param("id"): XML에서 #{id}로 사용할 수 있게 이름 지정
        // String id: 매개변수, 업데이트할 서류 ID
        @Param("status") String status,
        // String status: 서류의 상태(ex: APPROVED, REJECTED)
        @Param("adminId") String adminId,
        // @Param("adminId"): XML에서 #{adminId}로 사용할 수 있게 이름 지정
        // String adminId: 매개변수, 서류 검토한 관리자 ID
        @Param("rejectReason") String rejectReason
        // @Param("rejectReason"): XML에서 #{rejectReason}으로 사용할 수 있게 이름 지정
        // String rejectReason: 매개변수, 서류 거절 사유(거절 시에만 사용)
    );
    List<TutorSettlement> selectTutorSettlements();
    // List<TutorSettlement>: 반환타입, TutorSettlement 객체를 여러개 담은 리스트
    // selectTutorSettlements(): 메서드 이름
    // 실제 SQL=XML 파일의 <select id="selectTutorSettlements"> 태그와 매칭
    // 역할: 튜터들의 수익 정산 내역 가져옴
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.aloha.teamproject.mapper.AdminMapper">
<!-- Mapper: MyBatis Mapper의 시작, namespace: 이 Mapper가 매핑되는 인터페이스 경로 지정= "적어준다com.aloha.teamproject.mapper.AdminMapper"
namespace가 인터페이스의 전체경로(패키지+클래스명)와 일치하면 자동으로 매칭
 -->

 <slect id="selectPendingDocuments" resultType="com.aloha.teamproject.dto.TutorDocument">
<!-- select태그: select쿼리 정의, id: "selectPendingDocuments": 어떤 매서드와 매칭되는지, resultType: 조회결과를 어떤 타입으로 변환할지 지정.
com.aloha.teamproject.dto.TutorDocument" = TutorDocument 객체로 변환
변환원리: 조회된 컬럼명과 DTO 필드명이 같으면 자동으로 값이 채워짐 -->

   SELECT d.*, u.name as userName
    <!-- SELECT: 데이터조회, d.*: tutor_document 테이블의 모든 컬럼(no~updated_at)조회
    u.name as -->
   

</mapper>
```