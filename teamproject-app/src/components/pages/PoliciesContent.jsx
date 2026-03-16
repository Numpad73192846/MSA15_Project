import { Link } from 'react-router-dom'
import Layout from '../common/Layout'

const sections = [
	{
		title: '제1조 (목적)',
		body: ['본 약관은 튜터링 플랫폼이 제공하는 서비스 이용과 관련한 회사와 이용자의 권리, 의무 및 책임사항을 규정합니다.'],
	},
	{
		title: '제2조 (용어의 정의)',
		body: ['서비스는 튜터 매칭 및 관련 부가 기능을 의미합니다.', '회원은 약관 동의 후 가입 승인을 받은 이용자입니다.', '튜터는 교육 서비스를 제공하는 회원, 학생은 이를 이용하는 회원입니다.'],
	},
	{
		title: '제3조 (약관의 효력 및 변경)',
		body: ['약관은 서비스 이용 신청 시점부터 효력이 발생합니다.', '회사는 필요 시 약관을 변경할 수 있으며 공지로 안내합니다.', '변경 약관에 동의하지 않을 경우 이용 중단 및 탈퇴가 가능합니다.'],
	},
	{
		title: '제4조 (회원가입)',
		body: ['이용자는 정해진 양식에 따라 정보를 입력하고 회사 승인을 받아 가입합니다.', '타인 명의 도용, 허위 정보 등 요건 미충족 시 가입이 거절될 수 있습니다.'],
	},
	{
		title: '제5조 (서비스 이용)',
		body: ['서비스는 연중무휴 제공을 원칙으로 하며 점검 시 일시 중단될 수 있습니다.', '회원은 불법적이거나 부적절한 행위를 해서는 안 됩니다.'],
	},
	{
		title: '제6조 (튜터링 서비스)',
		body: ['수업 일정/내용/비용은 튜터와 학생 간 협의로 결정됩니다.', '회사는 매칭 플랫폼을 제공하며 실제 교육 품질 책임은 튜터에게 있습니다.'],
	},
	{
		title: '제7조 (결제 및 환불)',
		body: ['결제는 플랫폼 결제 시스템을 통해 진행됩니다.', '환불은 회사 환불 정책에 따르며, 튜터 귀책 시 전액 환불이 가능합니다.'],
	},
	{
		title: '제8조 (개인정보 보호)',
		body: ['관련 법령에 따라 개인정보를 보호하며, 세부 사항은 개인정보 처리방침을 따릅니다.'],
	},
	{
		title: '제9조 (회원의 의무)',
		body: ['회원은 법령/약관/이용안내를 준수해야 합니다.', '타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 금지합니다.'],
	},
	{
		title: '제10조 (면책조항)',
		body: ['천재지변 등 불가항력 상황에서는 책임이 제한될 수 있습니다.', '회원 귀책 사유로 인한 장애 및 회원 간 분쟁에 대해 회사 책임은 제한됩니다.'],
	},
	{
		title: '제11조 (분쟁해결)',
		body: ['분쟁 발생 시 당사자는 성실히 협의하며, 미합의 시 회사 본사 소재지 관할 법원을 따릅니다.'],
	},
]

const Policies = () => {
	return (
		<Layout>
			<section className='bg-slate-50 px-6 py-16'>
				<div className='mx-auto max-w-4xl'>
					<div className='mb-8 text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>이용약관</h1>
						<p className='mt-3 text-slate-500'>튜터링 서비스 이용약관을 안내해 드립니다.</p>
					</div>

					<div className='space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
						{sections.map((section) => (
							<article key={section.title} className='border-b border-slate-100 pb-5 last:border-0 last:pb-0'>
								<h2 className='text-lg font-bold text-slate-900'>{section.title}</h2>
								<ul className='mt-2 space-y-1 text-sm leading-7 text-slate-600'>
									{section.body.map((line) => (
										<li key={line}>{line}</li>
									))}
								</ul>
							</article>
						))}
						<div className='pt-3 text-center text-sm text-slate-500'>부칙: 본 약관은 2026년 2월 2일부터 시행됩니다.</div>
					</div>

					<div className='mt-6 text-center'>
						<Link to='/guide' className='inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'>돌아가기</Link>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Policies


