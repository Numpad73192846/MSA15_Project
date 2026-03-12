import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/image/logo.png'
import useAuth from '../utils/hooks/useAuth'

const Header = () => {

	const { isLogin, hasRole, logout } = useAuth()

	const isTutor = hasRole('ROLE_TUTOR')

	return (
		<header className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md shadow-sm z-40 h-[70px] border-b border-gray-300" >
			<div className='flex items-center justify-between max-w-[1320px] mx-auto px-2 size-full'>
				<Link to={'/'} className='flex items-center'>
					<img src={ logo } alt="투코스 로고" className='h-9' />
				</Link>

				{/* 중앙 네비게이션 (데스크탑) */}
				<nav className="hidden md:flex gap-5 text-lg">
					<Link to={'/'}>홈</Link>
					<Link to={'/tutor'}>튜터 찾기</Link>
					<Link to={'/korean-game'}>한국어게임</Link>
					<Link to={'/world-languages'}>세계인들의 언어</Link>
				</nav>

				{/* 오른쪽 버튼 영역 */}
				<div className="flex gap-3 shrink-0">
					{
						!isLogin ? (
							/* 로그인 전 */
							<div id="navGuestArea" className="flex gap-2" >
								<button className="" >로그인</button>
								<button className="" >회원가입</button>
							</div>
						) : (
							/* 로그인 후 */
							<div id="navUserArea" className="flex gap-2">
								<Link to={ isTutor ? '/tutor/mypage' : '/member/mypage' } className="btn btn-sm " >
									마이페이지
								</Link>
								{ isTutor && (
									<Link to={'/tutor/dashboard'} className="btn btn-sm " >
										대시보드
									</Link>
								) }
								<Link to={'/'} className="btn btn-sm btn-outline-dark " onClick={ logout }>
									로그아웃
								</Link>
							</div>
						) 
					}
				</div>
			</div>
		</header>
	)
}

export default Header