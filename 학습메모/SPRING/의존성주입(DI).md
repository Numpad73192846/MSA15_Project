```java
## 의존성주입(DI; Dependency Injection)
1. Dependency 뜻: 의존성, Injection 뜻: 주입
2. Dependency라는 뜻이 생소하다. 의존하다라는 말은 쉽게 말해 누군가는 무엇인가를 필요로 한다 라는 뜻이다.
3. 클래스에 빗대설명: A클래스가 작동하기 위해서는 B클래스가 필요하다.
   즉, "A클래스는 B클래스에 의존한다." 라고 표현한다.

4. 코드설명
 4-1 잘못된 예시:
public class Car {
    // Car는 Engine이 필요하다.(의존한다)
    private Engine engine;
    
    public Car() {
        this.engine = new GasolineEngine();
    }
    // 문제점: Car클래스가 직접 GasolineEngine을 생성함
    // Car 클래스 안에 "휘발유 엔진"이 고정되어 있음(하드코딩)
    // 나중에 "전기엔진"으로 바꾸려면 Car 클래스 전체를 수정해야함
    public void drive() {
        engine.start();
        // Engine의 기능에 의존
        System.out.println("자동차가 달린다.");
    }
}

5. 올바른 예시 DI구현방법 3가지
5-1. 생성자 주입(Constructor Injection)
public class Car {
    private Engine engine;
    // Car는 Enghine이 필요하다는 사실은 변함없음
    
    public Car(Engine engine) {
        this.engine = engine; // 외부에서 주입받은 Engine 저장
        // 객체를 만들 때 생성자를 통해 Engine을 주입
    }
}
Car car = new Car(new GasolineEngine());
// 

// ====================================

5-2. 세터 주입(Setter Injection)
public class Car {
    private Engine engine;

    public void setEngine(Engine engine) {
        this.engine = engine;
        // 세터 메서드를 통해 주입
    }
}
Car car = new Car();
car.setEngine(new GasolineEngine());
// 객체를 만든 후 setter로 넣어줌

// ====================================

5-3. 필드 주입(Field Injection) - Spring단골
public class Car { 
    @Autowired
    private Engine engine;
    // 스프링이 자동으로 주입해줌
}
    