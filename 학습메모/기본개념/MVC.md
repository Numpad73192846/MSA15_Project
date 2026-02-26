```JAVA
### MVC란?
Model-View-Controller의 약자, 애플리케이션을 세 가지 역할로 분리하는 디자인 패턴
1. Model: 데이터오 비즈니스 로직을 담당. DB와 통신하고 데이터를 처리
2. View: 사용자에게 보여지는 화면(UI). 데이터를 어떻게 표시할지 담당
3. Controller: Model과 View사이의 중간 역할. 사용자의 요청을 받아 Model에 전달,
    결과를 View로 넘김

### MVC 흐름
    사용자 요청
        ↓
Controller(@Controller)
        ↓
Model(@Service, @Repository)
        ↓
View(JSP, Thymeleaf, React 등)

4. 예시코드
@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users/{id}")
    public String getUser(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "userDetail";
    }
}

### MVC의 핵심 장점
관심사 분리로 각레이어가 독립적이기 때문에 유지보수가 쉽고, 팀작업 시 역할 분담이 명확해 진다.

```