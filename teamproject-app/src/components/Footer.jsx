import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
	const [showTopButton, setShowTopButton] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setShowTopButton(window.scrollY > 0)
		}

		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<>
			<footer className='bg-[#1a2332] px-5 py-10 text-slate-300'>
				<div className='mx-auto mb-10 grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4'>
					<div className='space-y-4'>
						<h4 className='text-base font-semibold text-white'>튜터링고</h4>
						<p className='text-sm leading-7 text-slate-400'>최고의 튜터와 함께하는<br />1:1 맞춤 당금 플롯</p>
					</div>

					<div className='space-y-4'>
						<h4 className='text-base font-semibold text-white'>서비스</h4>
						<ul className='space-y-2 text-sm'>
							<li><Link to='/tutors' className='transition hover:text-white'>튜터 찾기</Link></li>
							<li><Link to='/tutor/register' className='transition hover:text-white'>튜터 등록</Link></li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='text-base font-semibold text-white'>회사 소개</h4>
						<ul className='space-y-2 text-sm'>
							<li><Link to='/about' className='transition hover:text-white'>소개</Link></li>
							<li><Link to='/jobs' className='transition hover:text-white'>채용</Link></li>
							<li><Link to='/partnership' className='transition hover:text-white'>파트너십</Link></li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='text-base font-semibold text-white'>고객 지원</h4>
						<ul className='space-y-2 text-sm'>
							<li><Link to='/contact' className='transition hover:text-white'>문의하기</Link></li>
							<li><Link to='/faq' className='transition hover:text-white'>FAQ</Link></li>
							<li><Link to='/guide/policies' className='transition hover:text-white'>이용약관</Link></li>
						</ul>
					</div>
				</div>

				<div className='mx-auto max-w-[1200px] border-t border-slate-700 pt-5 text-center text-xs text-slate-500'>
					<p>&copy; 2026 튜터링고. All rights reserved.</p>
				</div>
			</footer>

			<button
				id='topBtn'
				className={`fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-[0_6px_16px_rgba(79,70,229,0.4)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#4338ca] ${showTopButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
				title='맨 위로'
				aria-label='맨 위로'
				onClick={scrollToTop}
			>
				<svg viewBox='0 0 24 24' className='h-6 w-6' aria-hidden='true'>
					<path d='M12 7l-6 6h4v4h4v-4h4z' fill='currentColor' />
				</svg>
			</button>
		</>
	)
}

export default Footer
