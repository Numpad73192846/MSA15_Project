## JSP 로그인 처리 로직 예시

이 코드는 JSP 환경에서 세션과 쿠키를 사용한 전형적인 로그인 처리 과정을 보여줍니다.

```js
<%@page import="java.util.UUID"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="shop.dto.User"%>
<%@page import="shop.dao.UserRepository"%>

<%
    String id = request.getParameter("id");	
    String pw = request.getParameter("pw");
    String rememberId = request.getParameter("rememberId");
    String autoLogin = request.getParameter("autoLogin");
    
    UserRepository userDAO = new UserRepository();
    User loginUser = userDAO.login(id, pw);
    
    // 1. 로그인 실패 처리
    if( loginUser == null ) {
        response.sendRedirect("login.jsp?msg=-1");
        return;
    }
    
    // 2. 로그인 성공 처리 (세션 사용)
    session.setAttribute("loginId", id);
    session.setAttribute("loginUser", loginUser);
    
    // 3. 아이디 저장 (쿠키 사용)
    if( rememberId != null && rememberId.equals("on") ) {
        Cookie cookie = new Cookie("rememberId", id);
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7일 유지
        cookie.setPath("/");
        response.addCookie(cookie);
    } else {
        Cookie cookie = new Cookie("rememberId", "");
        cookie.setMaxAge(0); // 즉시 삭제
        cookie.setPath("/");
        response.addCookie(cookie);
    }
    
    // 4. 자동 로그인 처리
    if( autoLogin != null && autoLogin.equals("on") ) {
        String token = userDAO.refreshToken(id); 
        Cookie cookie = new Cookie("token", token);
        cookie.setMaxAge(60 * 60 * 24 * 7);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    // 5. 로그인 완료 후 이동
    response.sendRedirect("complete.jsp?msg=0");		
%>
```
