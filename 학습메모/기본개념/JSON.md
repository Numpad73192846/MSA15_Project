JSON
```json
JASON(JavaScript Object Notation)
한글뜻: 자바스크립트 객체 표기법
1. 데이터를 주고 받을 때 사용하는 텍스트 기반의 데이터 형식
2. 자바스크립트와 매우 유사한 구조를 가지고 있음
3. key와 value로 이루어진 데이터를 표현
4. key는 문자열, value는 문자열, 숫자, 불리언, 배열, 객체, null을 가질 수 있음
5. key와 value는 콜론(:)으로 구분, key-value 쌍은 쉼표(,)로 구분
6. 객체는 중괄호({})로 감싸고, 배열은 대괄호([])로 감쌈
예시코드
{
    "success": true,
    "data":
    {
        "no": 1,
        "question": "낮날은 새가 듣고 밤말은 __가 듣는다",
        "answer": "소",
        "option": ["소", "말", "돼지", "닭"],
        "difficulty": "easy",
        "hint": "소과 동물"
    },
    "message": "ok"
}
```

```java
프로젝트의 API를 호출하면 위와 같은 JSON 형식의 데이터를 받게 된다.
스프링 부트가 자동으로 JAVA 객체를 JSON으로 변환해 줍니다.
JAVA → JSON
     ↑ Spring Boot

예시코드:
return ApiResponse.ok(proverb, SuccessCode.OK);
// 해석: ApiResponse는 성공(ok)이고, proverb는 데이터, SuccessCode.OK는 메시지이다.
// 이런 JSON 데이터를 받아서 화면에 뿌려주는 것이 AJAX의 역할이다.
// {"success": true, "data": {"no": 1, "question": "낮말은 새가 듣고 밤말은 __가 듣는다", "answer": "소", "option": ["소", "말", "돼지", "닭"], "difficulty": "easy", "hint": "소과 동물"}, "message": "ok"}
```

