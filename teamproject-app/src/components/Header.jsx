import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/image/logo.png'

const Header = () => {
  return (
	<header className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md shadow-sm z-40 h-[70px] border-b border-gray-300" >
        <div className='flex items-center justify-between max-w-[1320px] mx-auto px-2 size-full'>
			<Link to={'/'}>
                <img src={ logo } alt="투코스 로고" style={ { height: '36px' } }/>
			</Link>

			{/* 중앙 네비게이션 (데스크탑) */}
			<nav className="text-lg hidden md:flex md:g-5">
				<a href="/" className="">홈</a>
				<a href="/" className="">튜터 찾기</a>
				<a href="/" className="">한국어게임</a>
				<a href="/" className="">세계인들의 언어</a>
			</nav>

			{/* 오른쪽 버튼 영역 */}
			<div className="flex g-12 shrink-0">
				{
					isLogin ? (
						/* 로그인 전 */
						<div id="navGuestArea" className="g-2" >
							<button className="" >로그인</button>
							<button className="" >회원가입</button>
						</div>
					) : (
						/* 로그인 후 */
						<div id="navUserArea" className="g-2">
							<button id="" className="btn btn-sm " >
								마이페이지
							</button>
							<button id="" className="btn btn-sm " >
								대시보드
							</button>
							<button id="" className="btn btn-sm " >
								마이페이지
							</button>
							<button id="" className="btn btn-sm ">
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