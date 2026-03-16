import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/image/logo.png'
import useAuth from '../utils/hooks/useAuth'

const Header = () => {

	const { isLogin, isLoading, hasRole, logout } = useAuth()

	const isTutor = hasRole('ROLE_TUTOR')
	const buttonBaseClass = 'inline-flex min-w-24 h-[43px] items-center justify-center rounded-full border px-[14px] text-sm leading-[1.2] transition-colors'
	const guestLoginClass = `${buttonBaseClass} border-[#adb5bd] bg-transparent font-normal !text-[#8f98a1] hover:border-[#6c757d] hover:bg-[#6c757d] hover:!text-white`
	const guestSignupClass = `${buttonBaseClass} border-[#4f46e5] bg-[#4f46e5] font-normal !text-white hover:border-[#4338ca] hover:bg-[#4338ca] hover:!text-white`

	return (
		<header className='fixed inset-x-0 top-0 z-40 h-[70px] border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md'>
			<div className='mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-2'>
				<Link to={'/'} className='flex items-center'>
					<img src={ logo } alt="투코스 로고" className='h-9' />
				</Link>

				{/* 중앙 네비게이션 (데스크탑) */}
				<nav className='hidden items-center gap-5 md:flex'>
					<Link to={'/'} className='text-[1.125rem] font-semibold text-slate-800 transition hover:text-slate-900'>홈</Link>
					<Link to={'/tutors'} className='text-[1.125rem] font-semibold text-slate-800 transition hover:text-slate-900'>튜터 찾기</Link>
					<Link to={'/game/korean'} className='text-[1.125rem] font-semibold text-slate-800 transition hover:text-slate-900'>한국어게임</Link>
					<Link to={'/guide/language'} className='text-[1.125rem] font-semibold text-slate-800 transition hover:text-slate-900'>세계인들의 언어</Link>
				</nav>

				{/* 오른쪽 버튼 영역 */}
				<div className='flex shrink-0 gap-3'>
					{
						!isLogin || isLoading ? (
							/* 로그인 전 */
							<div id='navGuestArea' className='flex items-center gap-2'>
								<Link to={'/login'} className={guestLoginClass} >로그인</Link>
								<Link to={'/join'} className={guestSignupClass} >회원가입</Link>
							</div>
						) : (
							/* 로그인 후 */
							<div id='navUserArea' className='flex items-center gap-2'>
								<Link to={ isTutor ? '/tutor/mypage' : '/member/mypage' } className={`${buttonBaseClass} border-[#4f46e5] bg-white font-normal text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white`} >
									마이페이지
								</Link>
								{ isTutor && (
									<Link to={'/tutor/dashboard'} className={`${buttonBaseClass} border-[#4f46e5] bg-white font-normal text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white`} >
										대시보드
									</Link>
								) }
								<button type='button' className={`${buttonBaseClass} border-slate-800 bg-white font-normal text-slate-800 hover:bg-slate-800 hover:text-white`} onClick={ logout }>
									로그아웃
								</button>
							</div>
						) 
					}
				</div>
			</div>
		</header>
	)
}

export default Header