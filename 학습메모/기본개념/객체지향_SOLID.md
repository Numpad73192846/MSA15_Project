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

```

```java
객체지향 4대 특성
1. 캡슐화(Encapsulation)
 - 데이터와 메서드를 하나로 묶고, 외부에서 직접 접근못하게 숨김.
 - private 변수 + getter/setter 메서드 사용.

코드예시:
class Person {
    private String name; // 외부에서 직접 접근 불가
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}

2. 상속(Inheritance)
 - 부모 클래스의 속성/메서드를 자식 클래스가 물려받음
 - 코드 재사용성 증가

코드 예시:
class Animal {
    void eat() {
    }
}
class Dog extends Animal {
    void bark() {
    }
}

3. 다형성(Polymorphism)
 - 같은 이름의 메서드가 객체에 따라 다르게 동작.
 - 오버로딩(Overloading): 같은 클래스 내에서 메서드 이름은 같고, 매개변수만 다른 경우.
 - 오버라이딩(Overriding): 부모 클래스의 메서드를 자식 클래스에서 재정의.

코드 예시:
class Animal {
    void sound() {
    }
}

class Dog extends Animal {
    void sound() {
        System.out.print("멍멍!");
    }
}
class Cat extends Animal {
    void sound() {
        System.out.print("야옹!");
    }
}

Animal d = new dog();
d.sound(); // "멍멍!" 출력

Animal c = new cat();
c.sound(); // "야옹!" 출력

4. 추상화(Abstraction)
 - 복잡한 구현은 숨기고, 필요한 기능만 노출
 - 인터페이스나(Interface) 추상클래스(Abstract Class)로 구현.

코드 예시:
abstract class Animal {
    String name; // 변수 가질 수 있음
    void sleep() {
        System.out.println("잠을 잔다.") // 일반 메서드 가능
        abstract void sound(); // 추상 메서드 (구현 강제)
    }
}

인터페이스 vs 추상클래스
 추상클래스(Abstract Class, 상속의 상위 개념)
예시코드 비교
// 추상 클래스 예시
abstract class Vehicle {
}
class Car extends Vehicle {
}
// 공통 기능이 있고 "~의 한 종류" 관계일 때

 인터페이스(Interface)
interface Flyable {
}
class Airplane implements Flyable {
}
class Bird implements Flyable {
}
// 비행기, 새 등 모두  날 수 있음

```