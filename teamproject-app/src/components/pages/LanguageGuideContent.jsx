import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import usaFlag from '../../assets/image/flag/usa.svg'
import koreaFlag from '../../assets/image/flag/korea.svg'
import japanFlag from '../../assets/image/flag/japan.svg'
import chinaFlag from '../../assets/image/flag/china.svg'
import spainFlag from '../../assets/image/flag/spain.svg'
import franceFlag from '../../assets/image/flag/france.svg'

const languageMeta = {
	영어: { icon: usaFlag, desc: '글로벌 커뮤니케이션의 기본 언어. 취업, 유학, 여행까지 활용 범위가 가장 넓습니다.', tags: ['비즈니스', '회화', '시험 대비'] },
	중국어: { icon: chinaFlag, desc: '중화권 비즈니스와 문화 이해에 강점이 있는 언어입니다.', tags: ['HSK', '무역', '실무 회화'] },
	일본어: { icon: japanFlag, desc: '콘텐츠 소비부터 취업 준비까지 수요가 꾸준한 인기 언어입니다.', tags: ['JLPT', '여행 회화', '면접 준비'] },
	한국어: { icon: koreaFlag, desc: 'K-컬처와 유학 수요에 힘입어 학습자가 빠르게 늘고 있습니다.', tags: ['TOPIK', '일상 회화', '문화 이해'] },
	스페인어: { icon: spainFlag, desc: '중남미와 유럽에서 폭넓게 사용되는 실용적인 언어입니다.', tags: ['DELE', '여행', '비즈니스'] },
	프랑스어: { icon: franceFlag, desc: '예술, 패션, 요리 등 문화 콘텐츠와 함께 배우기 좋은 언어입니다.', tags: ['DELF/DALF', '문화', '유학 준비'] },
}

const fallbackLanguages = Object.keys(languageMeta).map((name, index) => ({
	rank: index + 1,
	name,
	seq: index + 1,
	...languageMeta[name],
}))

const LanguageGuide = () => {
	const [languageFields, setLanguageFields] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadLanguageFields = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await api.get('/language-fields')
				setLanguageFields(response.data?.data || [])
			} catch {
				setError('분야 데이터를 불러오지 못했습니다. 기본 목록을 표시합니다.')
				setLanguageFields([])
			} finally {
				setLoading(false)
			}
		}

		loadLanguageFields()
	}, [])

	const languages = useMemo(() => {
		if (!languageFields.length) return fallbackLanguages

		return [...languageFields]
			.sort((a, b) => (a.seq || 999) - (b.seq || 999))
			.map((field, index) => {
				const meta = languageMeta[field.name] || {}
				return {
					rank: field.seq || index + 1,
					name: field.name,
					icon: meta.icon || usaFlag,
					desc: meta.desc || `${field.name} 분야 학습자를 위한 전문 튜터를 만나보세요.`,
					tags: meta.tags || [field.category || '언어', '맞춤 수업', '1:1 튜터링'],
				}
			})
	}, [languageFields])

	return (
		<Layout>
			<section className='bg-gradient-to-b from-indigo-50 to-white px-6 py-16'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-12 text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>세계인들의 언어</h1>
						<p className='mt-3 text-slate-500'>학습 목적에 맞는 언어를 선택하고 전문 튜터와 시작하세요.</p>
					</div>

					{loading && (
						<div className='mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500'>데이터를 불러오는 중입니다...</div>
					)}
					{error && (
						<div className='mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>{error}</div>
					)}

					<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
						{languages.map((item) => (
							<div key={item.name} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'>
								<div className='mb-3 flex items-center justify-between'>
									<span className='rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700'>#{item.rank || 'Special'}</span>
									<img src={item.icon} alt={item.name} className='h-12 w-12 rounded-full border-2 border-slate-100 object-cover' />
								</div>
								<h3 className='text-2xl font-extrabold text-slate-900'>{item.name}</h3>
								<p className='mt-2 text-sm leading-7 text-slate-600'>{item.desc}</p>
								<div className='mt-4 flex flex-wrap gap-2'>
									{item.tags.map((tag) => (
										<span key={tag} className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>{tag}</span>
									))}
								</div>
							</div>
						))}
					</div>

					<div className='mt-10 flex flex-wrap justify-center gap-3'>
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

export default LanguageGuide


