package com.aloha.teamproject.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController{

	private final UserService userService;

	@GetMapping("")
	public String home() {
		return "index";
	}

	@GetMapping("/login")
	public String login() {
		return "auth/login";
	}

	@GetMapping("/join")
	public String join() {
		return "redirect:/login#tabSignup";
	}

	// ============================== 수정 (튜터 회원가입 매핑 이동) ==============================
	// 작성일: 2026-01-30
	// 수정 내용: /tutor/register 매핑을 TutorsPageController로 이동 (중복 제거)
	// 기존 코드 주석 처리:
	// @GetMapping("/tutor/register")
	// public String tutorRegister() {
	//     return "tutor/register";
	// }
	// ============================== 수정 종료 ==============================

	@GetMapping("/mypage")
	public String mypage(Authentication authentication, Model model) {
		Users user = null;
		if (authentication != null && authentication.isAuthenticated()) {
			try {
				user = userService.selectById(authentication.getName());
			} catch (Exception e) {
				log.error("/mypage 사용자 조회 실패", e);
			}
		}

		if (user == null) {
			user = new Users();
			user.setName("게스트");
			user.setUsername("guest");
		}

		model.addAttribute("user", user);
		return "member/mypage";
	}

	@GetMapping({"/tutor/mypage", "/mypages"})
	public String tutorMyPage() {
		return "tutor/mypage";
	}

	@GetMapping("/tutor/schedule-edit")
	public String tutorScheduleEdit() {
		return "tutor/schedule-edit";
	}

	// ============================== 수정 (이용안내 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /guide 경로 매핑 추가 - 메인페이지 "이용 안내" 버튼 클릭 시 이동
	@GetMapping("/guide")
	public String guide() {
		return "guide/tutor-guide";
	}
	// ============================== 수정 종료 ==============================

	// ============================== 수정 (이용약관 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /guide/policies 경로 매핑 추가 - Footer "이용약관" 클릭 시 이동
	@GetMapping("/guide/policies")
	public String policies() {
		return "guide/policies";
	}
	// ============================== 수정 종료 ==============================

	// ============================== 수정 (FAQ 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /faq 경로 매핑 추가 - Footer "FAQ" 클릭 시 이동
	@GetMapping("/faq")
	public String faq() {
		return "guide/faq";
	}
	// ============================== 수정 종료 ==============================

	// ============================== 수정 (문의하기 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /contact 경로 매핑 추가 - Footer "문의하기" 클릭 시 이동
	@GetMapping("/contact")
	public String contact() {
		return "guide/contact";
	}
	// ============================== 수정 종료 ==============================

	// ============================== 수정 (회사 소개 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /about 경로 매핑 추가 - Footer "소개" 클릭 시 이동
	@GetMapping("/about")
	public String about() {
		return "guide/aboutus";
	}
	// ============================== 수정 종료 ==============================

	// ============================== 수정 (파트너십 페이지 매핑 추가) ==============================
	// 작성일: 2026-02-02
	// 수정 내용: /partnership 경로 매핑 추가 - Footer "파트너십" 클릭 시 이동
	@GetMapping("/partnership")
	public String partnership() {
		return "guide/partner";
	}
	// ============================== 수정 종료 ==============================

}
