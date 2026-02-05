## JAVA의 5대 핵심요소: SOLID 원칙
1. S: Single Responsibility Principle (단일 책임 원칙)
 - 클래스 한개는 하나의 책임만 가져야 한다.
2. O: Open/Closed Principle (개방-폐쇄 원칙)
 - 확장에는 열리고, 수정에는 닫혀야 한다.
3. L: Liskov Substitution Principle (리스코프 치환 원칙)
 - 자식 클래스는 언제나 부모 클래스로 교체할 수 있어야 한다.
4. I: Interface Segregation Principle (인터페이스 분리 원칙)
 - 특정 클라이언트를 위한 인터페이스 분리.
5. D: Dependency Inversion Principle (의존성 역전 원칙)
 - 구체적인 클래스보다 추상화(인터페이스)에 의존해야 한다.

``` java
### JAVA의 객체 지향
객체는 데이터(속성)와 데이터를 다루는 행동(메서드)을 하나로 묶은 개념.
현실세계의 사물이나 개념을 프로그램으로 표현.
예: '자동차'객체면:
- 데이터: 색상, 속도, 연료량, 모델명 등
- 행동: 가속, 감속, 방향전환, 주유 등

예시코드
class car {
    // 데이터
    String color;
    int speed;
    int fuel;
    String model;
    // 행동
    void accelerate() {
        speed += 10;
        fuel -= 1;
    }
    void brake() {
        speed -= 10;
    }
}

1. 객체(Object)란? 현실 세계의 사물이나 개념을 코드로 표현한 것.
2. 객체는

```