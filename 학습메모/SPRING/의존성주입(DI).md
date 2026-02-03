```java
## 의존성주입(DI; Dependency Injection)
1. Dependency 뜻: 의존성, Injection 뜻: 주입
2. Dependency라는 뜻이 생소하다. 의존하다라는 말은 쉽게 말해 누군가는 무엇인가를 3. 필요로 한다 라는 뜻이다.
4. 클래스에 빗대설명: A클래스가 작동하기 위해서는 B클래스가 필요하다.
   즉, "A클래스는 B클래스에 의존한다." 라고 표현한다.

5. 코드설명
 5-1 잘못된 예시:
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

6. 올바른 예시
 6-1 의존성을 외부에서 주입(DI 적용):
public class Car {
    // Car는 여전히 Engine이 필요하다.(의존한다)
    private Engine engine;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
}