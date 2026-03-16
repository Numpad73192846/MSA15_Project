import React from 'react'
import { Link } from 'react-router-dom'
import {
	ArrowRight,
	BookOpenText,
	BriefcaseBusiness,
	ClipboardList,
	Globe,
	MessageCircleMore,
	Music2,
	Search,
	Tv,
} from 'lucide-react'
import Layout from '../common/Layout'
import logo from '../../assets/image/logo.png'
import teacherImage from '../../assets/image/teacher.png'
import starImage from '../../assets/image/star.png'
import timeImage from '../../assets/image/time.png'
import usaFlag from '../../assets/image/flag/usa.svg'
import koreaFlag from '../../assets/image/flag/korea.svg'
import japanFlag from '../../assets/image/flag/japan.svg'
import chinaFlag from '../../assets/image/flag/china.svg'
import spainFlag from '../../assets/image/flag/spain.svg'
import franceFlag from '../../assets/image/flag/france.svg'

const languages = [
	{ name: '영어', icon: usaFlag },
	{ name: '한국어', icon: koreaFlag },
	{ name: '일본어', icon: japanFlag },
	{ name: '중국어', icon: chinaFlag },
	{ name: '스페인어', icon: spainFlag },
	{ name: '프랑스어', icon: franceFlag },
]

const categories = [
	{ name: '회화', Icon: MessageCircleMore },
	{ name: '문법', Icon: BookOpenText },
	{ name: '비즈니스', Icon: BriefcaseBusiness },
	{ name: '노래', Icon: Music2 },
	{ name: '드라마', Icon: Tv },
	{ name: '문화', Icon: Globe },
]

const stats = [
	{ value: '100+', label: '검증된 전문 튜터', image: teacherImage, bgClass: 'bg-[#a390f8]' },
	{ value: '4.8', label: '평균 수강 만족도', image: starImage, bgClass: 'bg-[#fac980]' },
	{ value: '24h', label: '언제든지 자유 예약', image: timeImage, bgClass: 'bg-[#71e9d9]' },
]

const Home = () => {
	return (
		<Layout>
			<div className='overflow-hidden'>
				<section className='home-hero relative flex min-h-[40rem] items-center justify-center overflow-hidden bg-[#0B0B1A] px-6 py-8 text-white'>
					<div className='hero-orb hero-orb-1' />
					<div className='hero-orb hero-orb-2' />
					<div className='relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-4 text-center'>
						<p className='opacity-40 brightness-0 invert'>
							<img src={logo} alt='투코스 로고' className='h-9' />
						</p>
						<div className='space-y-4'>
							<p className='text-xl font-light md:text-2xl'>언어 학습이 필요한 순간,</p>
							<h1 className='text-4xl font-extrabold leading-[1.35] md:text-6xl'>
								나에게 <span className='hero-gradient-text'>딱 맞는 튜터</span>를 찾아보세요!!
							</h1>
							<p className='mx-auto max-w-3xl text-lg text-white/70 md:text-2xl'>
								검증된 전문 튜터와 함께 1:1 맞춤 학습을 시작하세요! 내일이면 나도 언어박사!!
							</p>
						</div>
						<div className='mt-6 flex flex-wrap justify-center gap-3'>
							<Link to='/tutors' className='inline-flex min-w-60 items-center justify-center gap-3 rounded-[20px_20px_20px_8px] bg-[#4338ca] px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-1 hover:rounded-[20px_8px_20px_20px] hover:shadow-[0_8px_20px_rgba(67,56,202,0.3)]'>
								<Search className='h-5 w-5' strokeWidth={2} />
								튜터 찾기
							</Link>
							<Link to='/guide' className='inline-flex min-w-60 items-center justify-center gap-3 rounded-[20px_20px_20px_8px] bg-white px-8 py-4 text-base font-semibold !text-slate-900 transition hover:-translate-y-1 hover:rounded-[20px_8px_20px_20px] hover:shadow-[0_8px_20px_rgba(67,56,202,0.3)] hover:!text-slate-900'>
								<ClipboardList className='h-5 w-5' strokeWidth={2} />
								이용 안내
							</Link>
						</div>
					</div>
				</section>

				<section className='bg-white px-6 py-18'>
					<div className='mx-auto max-w-6xl'>
						<div className='mb-12 text-center'>
							<h2 className='mb-3 text-3xl font-bold text-slate-900 md:text-5xl'>믿을 수 있는 튜터 매칭 플랫폼</h2>
							<p className='text-slate-500'>수천 명의 학습자들이 선택한 이유</p>
						</div>
						<div className='grid gap-10 md:grid-cols-3'>
							{stats.map((item) => (
								<div key={item.label}>
									<div className={`relative rounded-[4rem_6rem_6rem_2rem] pt-10 ${item.bgClass}`}>
										<img src={item.image} alt={item.label} className='relative mx-auto h-44 object-contain' />
									</div>
									<div className='pt-8 text-center'>
										<h3 className='mb-2 text-5xl font-extrabold text-slate-900'>{item.value}</h3>
										<p className='text-lg text-slate-500'>{item.label}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className='bg-slate-100 px-6 py-18'>
					<div className='mx-auto max-w-6xl'>
						<div className='mb-12 text-center'>
							<h2 className='mb-3 text-3xl font-bold text-slate-900 md:text-5xl'>인기 언어에서 시작하세요</h2>
							<p className='text-slate-500'>다양한 언어의 전문 튜터를 만나보세요</p>
						</div>

						<div className='mb-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
							{languages.map((item, index) => (
								<Link key={item.name} to='/tutors' className={`block text-center transition hover:-translate-y-1.5 ${index < languages.length - 1 ? 'lg:border-r lg:border-slate-200' : ''}`}>
									<div className='mb-3 flex justify-center'>
										<img src={item.icon} alt={item.name} className='h-[4.5rem] w-[4.5rem] rounded-full border-4 border-white object-cover' />
									</div>
									<h5 className='font-bold text-slate-800'>{item.name}</h5>
								</Link>
							))}
						</div>

						<div className='text-center'>
							<h3 className='mb-5 text-2xl font-bold text-slate-900'>카테고리별로 찾기</h3>
							<div className='flex flex-wrap justify-center gap-2'>
								{categories.map(({ name, Icon }) => (
									<Link key={name} to='/tutors' className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-600 shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:bg-[#0d6efd] hover:text-white'>
										<Icon className='h-4 w-4' strokeWidth={2} />
										{name}
									</Link>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className='home-cta relative overflow-hidden px-6 py-18 text-white'>
					<div className='hero-orb hero-orb-1 opacity-40' />
					<div className='hero-orb hero-orb-2 opacity-40' />
					<div className='relative z-10 mx-auto max-w-4xl text-center'>
						<h2 className='mb-4 text-4xl font-light md:text-6xl'><span className='font-extrabold text-[#fff386]'>지금 바로 시작</span> 하세요!!</h2>
						<p className='mb-10 text-lg text-white/80 md:text-2xl'>완벽한 튜터를 찾아 언어 학습 목표를 달성하세요</p>
						<div className='flex flex-wrap justify-center gap-3'>
							<Link to='/tutors' className='group inline-flex min-w-64 items-center justify-center gap-3 rounded-[20px_20px_20px_8px] bg-[#4338ca] px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-1 hover:rounded-[20px_8px_20px_20px] hover:shadow-[0_8px_20px_rgba(67,56,202,0.3)]'>
								튜터 둘러보기 <ArrowRight className='h-5 w-5 transition group-hover:translate-x-1' strokeWidth={2} />
							</Link>
							<Link to='/about' className='group inline-flex min-w-64 items-center justify-center gap-3 rounded-[20px_20px_20px_8px] bg-white px-8 py-4 text-base font-semibold !text-slate-900 transition hover:-translate-y-1 hover:rounded-[20px_8px_20px_20px] hover:shadow-[0_8px_20px_rgba(67,56,202,0.3)] hover:!text-slate-900'>
								튜터링고 알아보기 <ArrowRight className='h-5 w-5 transition group-hover:translate-x-1' strokeWidth={2} />
							</Link>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	)
}

export default Home

