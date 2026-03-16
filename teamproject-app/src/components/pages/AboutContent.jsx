import { Link } from 'react-router-dom'
import Layout from '../common/Layout'

const values = [
	{
		title: '신뢰',
		description: '엄격한 검증 시스템을 통해 신뢰할 수 있는 튜터만 제공합니다.',
		emoji: '???',
	},
	{
		title: '소통',
		description: '튜터와 학생 간의 원활한 소통으로 최적의 학습 환경을 만듭니다.',
		emoji: '??',
	},
	{
		title: '성장',
		description: '개인 맞춤형 교육을 통해 학생과 튜터 모두의 성장을 추구합니다.',
		emoji: '??',
	},
]

const features = [
	{ title: '쉬운 튜터 검색', description: '과목, 지역, 가격대, 수업 방식 등 다양한 조건으로 빠르게 탐색할 수 있습니다.' },
	{ title: '검증된 튜터', description: '학력, 경력, 자격증을 검토한 튜터를 중심으로 매칭합니다.' },
	{ title: '유연한 스케줄', description: '원하는 시간대와 학습 리듬에 맞춰 수업 일정을 유연하게 구성할 수 있습니다.' },
	{ title: '안전한 결제', description: '다양한 결제 수단과 보안 체계로 안심하고 수업을 예약할 수 있습니다.' },
]

const stats = [
	{ label: '검증된 튜터', value: '1,500+' },
	{ label: '활동 회원', value: '5,000+' },
	{ label: '완료된 수업', value: '20,000+' },
	{ label: '평균 만족도', value: '4.8' },
]

const About = () => {
	return (
		<Layout>
			<section className='bg-gradient-to-b from-white to-slate-50 px-6 py-16'>
				<div className='mx-auto max-w-6xl space-y-10'>
					<div className='text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>튜터링고 소개</h1>
						<p className='mt-3 text-lg text-slate-500'>최고의 튜터와 함께하는 1:1 맞춤 학습 플랫폼</p>
					</div>

					<div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm'>
						<h2 className='text-2xl font-bold text-slate-900'>우리는 교육의 미래를 만들어갑니다</h2>
						<p className='mt-4 leading-8 text-slate-600'>
							튜터링고는 누구나 원하는 분야의 전문가로부터 1:1 맞춤 교육을 받을 수 있는 온·오프라인 튜터링 매칭 플랫폼입니다.
							 검증된 튜터와 학생을 연결하여 더 좋은 학습 경험을 제공합니다.
						</p>
					</div>

					<div className='grid gap-4 md:grid-cols-3'>
						{values.map((item) => (
							<div key={item.title} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
								<div className='text-3xl'>{item.emoji}</div>
								<h3 className='mt-3 text-xl font-bold text-slate-900'>{item.title}</h3>
								<p className='mt-2 text-sm leading-7 text-slate-600'>{item.description}</p>
							</div>
						))}
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						{features.map((item) => (
							<div key={item.title} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
								<h3 className='text-lg font-bold text-slate-900'>{item.title}</h3>
								<p className='mt-2 text-sm leading-7 text-slate-600'>{item.description}</p>
							</div>
						))}
					</div>

					<div className='rounded-3xl bg-[#4f46e5] p-8 text-white'>
						<h3 className='text-center text-2xl font-bold'>튜터링고와 함께한 성장</h3>
						<div className='mt-6 grid gap-4 text-center md:grid-cols-4'>
							{stats.map((item) => (
								<div key={item.label}>
									<div className='text-4xl font-extrabold'>{item.value}</div>
									<div className='mt-1 text-sm text-white/80'>{item.label}</div>
								</div>
							))}
						</div>
					</div>

					<div className='flex flex-wrap justify-center gap-3'>
						<Link to='/tutors' className='inline-flex min-w-44 items-center justify-center rounded-xl bg-[#4f46e5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4338ca]'>
							튜터 찾기
						</Link>
						<Link to='/guide' className='inline-flex min-w-44 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'>
							이용 안내
						</Link>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default About


