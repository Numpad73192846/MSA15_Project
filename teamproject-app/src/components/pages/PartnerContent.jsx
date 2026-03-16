import { Link } from 'react-router-dom'
import Layout from '../common/Layout'

const partners = [
	{ name: '삼성전자', summary: '기술 교육 및 인재 양성 프로그램 공동 운영' },
	{ name: 'LG전자', summary: 'AI/전자공학 분야 전문 교육 콘텐츠 협력' },
	{ name: '현대자동차', summary: '미래 모빌리티 및 공학 교육 프로그램 협업' },
	{ name: 'SK하이닉스', summary: '반도체 기술 교육 및 전문 인력 양성 협력' },
	{ name: '네이버', summary: '개발/클라우드 실무형 학습 프로그램 운영' },
	{ name: '카카오', summary: '모바일 서비스와 플랫폼 역량 강화 교육 협력' },
]

const Partner = () => {
	return (
		<Layout>
			<section className='bg-slate-50 px-6 py-16'>
				<div className='mx-auto max-w-6xl'>
					<div className='text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>파트너십</h1>
						<p className='mt-3 text-slate-500'>튜터링고와 함께하는 글로벌 파트너 기업들</p>
					</div>

					<div className='mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
						<h2 className='text-2xl font-bold text-slate-900'>신뢰할 수 있는 파트너와 함께합니다</h2>
						<p className='mt-3 text-sm leading-7 text-slate-600'>튜터링고는 국내외 기업과 전략적 파트너십을 맺고 교육 품질 향상과 글로벌 확장을 함께 추진하고 있습니다.</p>
					</div>

					<div className='mt-6 grid gap-4 md:grid-cols-2'>
						{partners.map((item) => (
							<article key={item.name} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<div className='inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-[#4f46e5]'>PARTNER</div>
								<h3 className='mt-3 text-lg font-bold text-slate-900'>{item.name}</h3>
								<p className='mt-2 text-sm leading-6 text-slate-600'>{item.summary}</p>
							</article>
						))}
					</div>

					<div className='mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
						<h3 className='text-xl font-bold text-slate-900'>글로벌 파트너십 확대 중</h3>
						<p className='mt-2 text-sm leading-7 text-slate-600'>국내외 다양한 기관과 협업을 확장해 더 나은 학습 경험을 제공하고 있습니다.</p>
					</div>

					<div className='mt-8 flex flex-wrap justify-center gap-3'>
						<Link to='/contact' className='inline-flex min-w-32 items-center justify-center rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'>문의하기</Link>
						<Link to='/guide' className='inline-flex min-w-32 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'>돌아가기</Link>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Partner


