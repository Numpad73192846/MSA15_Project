import { Link } from 'react-router-dom'
import Layout from '../common/Layout'

const learnerSteps = ['회원가입', '튜터 검색', '수업 예약', '학습 시작']
const tutorSteps = ['튜터 신청', '프로필 작성', '일정 설정', '수업 진행']

const features = [
	{ title: '다양한 튜터 탐색', desc: '언어/학문 등 여러 분야의 전문 튜터를 검색하고 비교할 수 있습니다.' },
	{ title: '간편한 예약', desc: '원하는 시간대에 맞춰 수업을 빠르게 예약할 수 있습니다.' },
	{ title: '신뢰할 수 있는 리뷰', desc: '실제 수강생 리뷰를 참고해 나에게 맞는 튜터를 선택할 수 있습니다.' },
]

const faq = [
	{ q: '수업은 어떤 방식으로 진행되나요?', a: '온라인 화상 또는 오프라인 대면 방식으로 진행되며, 튜터 프로필에서 확인할 수 있습니다.' },
	{ q: '예약 취소는 어떻게 하나요?', a: '마이페이지 예약 내역에서 취소할 수 있으며, 환불 규정은 취소 시점에 따라 적용됩니다.' },
	{ q: '결제는 어떻게 이루어지나요?', a: '카드/간편결제 등 다양한 방식으로 결제할 수 있습니다.' },
]

const TutorGuide = () => {
	return (
		<Layout>
			<section className='bg-[#0f4c81] px-6 py-16 text-white'>
				<div className='mx-auto max-w-6xl text-center'>
					<h1 className='text-4xl font-extrabold md:text-5xl'>이용 안내</h1>
					<p className='mt-3 text-sm text-cyan-100 md:text-base'>튜터링고에서 쉽고 편리하게 학습을 시작해 보세요.</p>
				</div>
			</section>

			<section className='bg-white px-6 py-14'>
				<div className='mx-auto max-w-6xl'>
					<div className='text-center'>
						<h2 className='text-3xl font-bold text-slate-900'>튜터링고는 어떤 서비스인가요?</h2>
						<p className='mt-2 text-slate-500'>검증된 튜터와 학습자를 연결하는 1:1 맞춤 학습 플랫폼입니다.</p>
					</div>
					<div className='mt-8 grid gap-4 md:grid-cols-3'>
						{features.map((item) => (
							<article key={item.title} className='rounded-2xl border border-slate-200 bg-slate-50 p-6'>
								<h3 className='text-lg font-bold text-slate-900'>{item.title}</h3>
								<p className='mt-2 text-sm leading-6 text-slate-600'>{item.desc}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className='bg-slate-50 px-6 py-14'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='text-center text-3xl font-bold text-slate-900'>학습자 이용 방법</h2>
					<div className='mt-8 grid gap-4 md:grid-cols-4'>
						{learnerSteps.map((step, idx) => (
							<div key={step} className='rounded-2xl border border-slate-200 bg-white p-5 text-center'>
								<div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#4f46e5] text-sm font-bold text-white'>{idx + 1}</div>
								<h3 className='mt-3 font-bold text-slate-900'>{step}</h3>
							</div>
						))}
					</div>
					<div className='mt-6 text-center'>
						<Link to='/tutors' className='inline-flex rounded-full bg-[#4f46e5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4338ca]'>튜터 찾아보기</Link>
					</div>
				</div>
			</section>

			<section className='bg-white px-6 py-14'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='text-center text-3xl font-bold text-slate-900'>튜터 등록 방법</h2>
					<div className='mt-8 grid gap-4 md:grid-cols-4'>
						{tutorSteps.map((step, idx) => (
							<div key={step} className='rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center'>
								<div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white'>{idx + 1}</div>
								<h3 className='mt-3 font-bold text-slate-900'>{step}</h3>
							</div>
						))}
					</div>
					<div className='mt-6 text-center'>
						<Link to='/tutor/profile-edit' className='inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700'>튜터 정보 관리</Link>
					</div>
				</div>
			</section>

			<section className='bg-slate-50 px-6 py-14'>
				<div className='mx-auto max-w-4xl'>
					<h2 className='text-center text-3xl font-bold text-slate-900'>자주 묻는 질문</h2>
					<div className='mt-8 space-y-3'>
						{faq.map((item) => (
							<details key={item.q} className='rounded-2xl border border-slate-200 bg-white p-5'>
								<summary className='cursor-pointer list-none font-semibold text-slate-900'>{item.q}</summary>
								<p className='mt-3 text-sm leading-7 text-slate-600'>{item.a}</p>
							</details>
						))}
					</div>
					<div className='mt-6 text-center'>
						<Link to='/faq' className='inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'>FAQ 전체 보기</Link>
					</div>
				</div>
			</section>

			<section className='bg-[#51b9c7] px-6 py-14 text-center text-white'>
				<h2 className='text-3xl font-extrabold'>지금 바로 시작하세요</h2>
				<p className='mt-2 text-cyan-100'>검증된 튜터와 새로운 학습 경험을 시작해 보세요.</p>
				<div className='mt-5 flex flex-wrap justify-center gap-3'>
					<Link to='/join' className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f4c81]'>회원가입</Link>
					<Link to='/tutors' className='rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white'>튜터 둘러보기</Link>
				</div>
			</section>
		</Layout>
	)
}

export default TutorGuide


