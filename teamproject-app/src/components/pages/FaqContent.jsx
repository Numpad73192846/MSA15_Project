import { Link } from 'react-router-dom'
import Layout from '../common/Layout'

const faqs = [
	{
		q: '튜터링고 서비스는 어떻게 이용하나요?',
		a: '회원가입 후 원하는 과목과 조건에 맞는 튜터를 검색하고, 프로필을 확인한 뒤 예약과 결제를 진행하면 됩니다.',
	},
	{
		q: '회원가입은 필수인가요?',
		a: '튜터 검색은 비회원도 가능하지만, 예약 및 결제를 위해서는 회원가입이 필요합니다.',
	},
	{
		q: '튜터는 어떻게 선택하나요?',
		a: '과목, 가격대, 수업 방식 필터를 활용하고 튜터의 경력·리뷰·평점을 함께 확인해 선택할 수 있습니다.',
	},
	{
		q: '결제는 어떤 방법으로 하나요?',
		a: '신용카드, 계좌이체, 간편결제 등 다양한 결제 수단을 지원합니다.',
	},
	{
		q: '환불은 가능한가요?',
		a: '수업 시작 24시간 전까지는 전액 환불이 가능하며, 이후는 정책에 따라 부분 환불됩니다.',
	},
	{
		q: '온라인/오프라인 수업 모두 가능한가요?',
		a: '튜터마다 제공 방식이 다르며, 검색 필터로 원하는 수업 방식을 선택할 수 있습니다.',
	},
	{
		q: '튜터로 등록하려면 어떻게 하나요?',
		a: '회원가입 후 튜터 등록에서 학력/경력/자격증 등 정보를 제출하면 심사 후 활동할 수 있습니다.',
	},
	{
		q: '수업료 정산은 언제 이루어지나요?',
		a: '수업 완료 확인 이후 정산이 진행되며, 정책에 맞춰 등록 계좌로 지급됩니다.',
	},
		{
		q: '추가 문의는 어디로 하나요?',
		a: '문의하기 페이지에서 직접 문의를 남기거나 고객센터 연락처를 통해 문의할 수 있습니다.',
	},
	{
		q: '튜터 신원은 어떻게 확인하나요?',
		a: '등록 시 신분/학력/경력 서류 검토와 리뷰/평점 시스템으로 품질을 지속 관리합니다.',
	},
]

const Faq = () => {
	return (
		<Layout>
			<section className='bg-slate-50 px-6 py-16'>
				<div className='mx-auto max-w-5xl'>
					<div className='mb-10 text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>자주 묻는 질문</h1>
						<p className='mt-3 text-slate-500'>서비스 이용 중 자주 물어보는 내용을 모았습니다.</p>
					</div>

					<div className='space-y-4'>
						{faqs.map((item) => (
							<details key={item.q} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<summary className='cursor-pointer list-none text-base font-semibold text-slate-900 md:text-lg'>
									<span className='mr-2 text-[#4f46e5]'>Q.</span>{item.q}
								</summary>
								<p className='mt-3 text-sm leading-7 text-slate-600 md:text-base'>
									<span className='mr-2 font-semibold text-[#4f46e5]'>A.</span>{item.a}
								</p>
							</details>
						))}
					</div>

					<div className='mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm'>
						<h3 className='text-2xl font-bold text-slate-900'>원하는 답변을 찾지 못하셨나요?</h3>
						<p className='mt-2 text-slate-500'>문의 페이지에서 자세히 남겨주시면 빠르게 답변드릴게요.</p>
						<div className='mt-5 flex flex-wrap justify-center gap-3'>
							<Link to='/contact' className='inline-flex min-w-36 items-center justify-center rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'>
								문의하기
							</Link>
							<Link to='/guide' className='inline-flex min-w-36 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'>
								이용 안내
							</Link>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Faq


