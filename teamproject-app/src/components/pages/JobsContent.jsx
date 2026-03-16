import { useMemo, useState } from 'react'
import Layout from '../common/Layout'

const categories = [
	{ key: 'all', label: '전체' },
	{ key: 'dev', label: '개발' },
	{ key: 'design', label: '디자인' },
	{ key: 'pm', label: '기획' },
	{ key: 'marketing', label: '마케팅' },
	{ key: 'operation', label: '운영' },
	{ key: 'education', label: '교육' },
]

const jobs = [
	{ category: 'dev', categoryLabel: '개발', title: '백엔드 개발자 (Spring Boot)', desc: '핵심 서비스 아키텍처를 설계하고 안정적인 API를 만듭니다.', location: '서울 강남', type: '정규직', exp: '경력 3년 이상' },
	{ category: 'dev', categoryLabel: '개발', title: '프론트엔드 개발자 (React)', desc: '학습자와 튜터가 매일 쓰고 싶은 화면을 설계하고 구현합니다.', location: '서울 강남', type: '정규직', exp: '경력 2년 이상' },
	{ category: 'dev', categoryLabel: '개발', title: 'DevOps 엔지니어', desc: '배포 자동화와 모니터링 체계를 고도화해 운영 품질을 높입니다.', location: '서울 강남', type: '정규직', exp: '경력 3년 이상' },
	{ category: 'design', categoryLabel: '디자인', title: '프로덕트 디자이너', desc: '리서치 기반 UX 설계와 디자인 시스템 개선을 담당합니다.', location: '서울 강남', type: '정규직', exp: '경력 2년 이상' },
	{ category: 'pm', categoryLabel: '기획', title: '프로덕트 매니저 (PM)', desc: '학습 여정 전반의 지표를 정의하고 우선순위를 리드합니다.', location: '서울 강남', type: '정규직', exp: '경력 3년 이상' },
	{ category: 'marketing', categoryLabel: '마케팅', title: '그로스 마케터', desc: '유저 획득과 리텐션 개선을 위한 퍼널 실험을 실행합니다.', location: '서울 강남', type: '정규직', exp: '경력 2년 이상' },
	{ category: 'operation', categoryLabel: '운영', title: 'CX 매니저', desc: '고객 문의 프로세스를 개선하고 경험 품질을 관리합니다.', location: '서울 강남', type: '정규직', exp: '신입/경력' },
	{ category: 'education', categoryLabel: '교육', title: '교육 콘텐츠 기획자', desc: '튜터와 학습자를 위한 커리큘럼/콘텐츠 구조를 기획합니다.', location: '서울 강남', type: '정규직', exp: '경력 2년 이상' },
]

const cultures = [
	{ icon: '??', title: '임팩트 중심', desc: '양보다 결과를 봅니다. 중요한 문제를 끝까지 해결합니다.' },
	{ icon: '??', title: '투명한 소통', desc: '직급보다 근거를 우선합니다. 정보는 열린 채로 공유합니다.' },
	{ icon: '??', title: '빠른 실행', desc: '작게 실험하고 빨리 개선합니다. 학습 속도를 경쟁력으로 만듭니다.' },
]

const benefits = [
	{ group: '생활 지원', color: 'indigo', items: ['유연 근무제 + 주 2회 재택', '식비/간식 지원', '연 1회 건강검진', '경조사 지원'] },
	{ group: '성장 지원', color: 'emerald', items: ['교육비/도서/컨퍼런스 지원', '최신 업무 장비 제공', '튜터링고 수업 무료 이용', '근속 리프레시 휴가'] },
]

const processSteps = ['서류 접수', '직무 면접', '컬처 면접', '최종 합류']

const Jobs = () => {
	const [activeCategory, setActiveCategory] = useState('all')

	const filteredJobs = useMemo(() => {
		if (activeCategory === 'all') return jobs
		return jobs.filter((item) => item.category === activeCategory)
	}, [activeCategory])

	return (
		<Layout>
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-16 text-white'>
				<div className='mx-auto max-w-6xl'>
					<div className='inline-flex rounded-full border border-indigo-300/40 bg-indigo-300/15 px-3 py-1 text-xs font-semibold text-indigo-200'>We're Hiring</div>
					<h1 className='mt-4 text-4xl font-extrabold leading-tight md:text-5xl'>튜터링고와 함께 교육의 미래를 만듭니다</h1>
					<p className='mt-4 max-w-2xl text-sm text-slate-200 md:text-base'>모든 사람이 더 좋은 배움을 만날 수 있게, 서비스와 조직을 함께 성장시킬 동료를 찾고 있어요.</p>
				</div>
			</section>

			<section className='sticky top-[70px] z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur'>
				<div className='mx-auto flex max-w-6xl flex-wrap gap-2'>
					{categories.map((item) => (
						<button
							type='button'
							key={item.key}
							onClick={() => setActiveCategory(item.key)}
							className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
								activeCategory === item.key
									? 'border-[#4f46e5] bg-[#4f46e5] text-white'
									: 'border-slate-200 bg-white text-slate-600 hover:border-[#4f46e5] hover:bg-indigo-50 hover:text-[#4f46e5]'
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</section>

			<section className='bg-slate-50 px-6 py-12'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-4 flex items-center justify-between'>
						<h2 className='text-2xl font-bold text-slate-900'>채용 중인 포지션</h2>
						<span className='text-sm font-semibold text-slate-500'>총 <span className='text-[#4f46e5]'>{filteredJobs.length}</span>개</span>
					</div>
					{filteredJobs.length === 0 ? (
						<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>해당 분야의 채용 공고가 없습니다.</div>
					) : (
						<div className='space-y-3'>
							{filteredJobs.map((item) => (
								<article key={`${item.category}-${item.title}`} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c7d2fe] hover:shadow-md'>
									<div className='inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-[#4f46e5]'>{item.categoryLabel}</div>
									<h3 className='mt-3 text-lg font-bold text-slate-900'>{item.title}</h3>
									<p className='mt-2 text-sm leading-6 text-slate-600'>{item.desc}</p>
									<div className='mt-3 flex flex-wrap gap-3 text-xs text-slate-500'>
										<span>{item.location}</span>
										<span>{item.type}</span>
										<span>{item.exp}</span>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>

			<section className='bg-white px-6 py-14'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-8 text-center'>
						<h2 className='text-2xl font-bold text-slate-900'>이런 문화에서 일해요</h2>
					</div>
					<div className='grid gap-4 md:grid-cols-3'>
						{cultures.map((item) => (
							<div key={item.title} className='rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50 p-6'>
								<div className='text-2xl'>{item.icon}</div>
								<h3 className='mt-3 text-lg font-bold text-slate-900'>{item.title}</h3>
								<p className='mt-2 text-sm leading-6 text-slate-600'>{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='bg-slate-50 px-6 py-14'>
				<div className='mx-auto grid max-w-6xl gap-4 lg:grid-cols-2'>
					{benefits.map((group) => (
						<div key={group.group} className='rounded-2xl border border-slate-200 bg-white p-6'>
							<h3 className={`text-lg font-bold ${group.color === 'indigo' ? 'text-[#4f46e5]' : 'text-emerald-600'}`}>{group.group}</h3>
							<ul className='mt-4 space-y-2 text-sm text-slate-600'>
								{group.items.map((item) => (
									<li key={item} className='rounded-lg bg-slate-50 px-3 py-2'>{item}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			<section className='bg-white px-6 py-14'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='text-center text-2xl font-bold text-slate-900'>합류 여정</h2>
					<div className='mt-8 grid gap-4 md:grid-cols-4'>
						{processSteps.map((step, index) => (
							<div key={step} className='rounded-2xl border border-slate-200 p-5 text-center'>
								<div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4f46e5] to-indigo-400 text-sm font-bold text-white'>{index + 1}</div>
								<h3 className='mt-3 text-base font-bold text-slate-900'>{step}</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='bg-gradient-to-r from-[#4f46e5] to-indigo-500 px-6 py-14 text-center text-white'>
				<h2 className='text-3xl font-extrabold'>함께 일할 준비가 되셨나요?</h2>
				<p className='mt-2 text-indigo-100'>지원서는 언제든 환영합니다.</p>
				<a href='mailto:recruit@tutoringgo.com' className='mt-5 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#4f46e5]'>recruit@tutoringgo.com 으로 지원하기</a>
			</section>
		</Layout>
	)
}

export default Jobs


