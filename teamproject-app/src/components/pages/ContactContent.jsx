import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const categoryOptions = [
	{ value: 'INQUIRY', label: '일반 문의' },
	{ value: 'PAYMENT', label: '결제 문의' },
	{ value: 'ACCOUNT', label: '계정 문의' },
	{ value: 'REPORT', label: '신고' },
]

const formatDateTime = (value) => {
	if (!value) return '-'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '-'
	return new Intl.DateTimeFormat('ko-KR', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

const statusText = (status) => {
	if (status === 'DONE') return '완료'
	if (status === 'IN_PROGRESS') return '처리중'
	return '접수'
}

const Contact = () => {
	const { isLogin } = useAuth()
	const [form, setForm] = useState({
		contactName: '',
		contactEmail: '',
		contactPhone: '',
		category: 'INQUIRY',
		title: '',
		content: '',
	})
	const [submitting, setSubmitting] = useState(false)
	const [loadingList, setLoadingList] = useState(false)
	const [inquiries, setInquiries] = useState([])
	const [selectedInquiryId, setSelectedInquiryId] = useState(null)
	const [messages, setMessages] = useState([])
	const [loadingMessages, setLoadingMessages] = useState(false)
	const [newMessage, setNewMessage] = useState('')
	const [sendingMessage, setSendingMessage] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		const preload = async () => {
			if (!isLogin) {
				setInquiries([])
				return
			}
			try {
				const [meResponse, myInquiriesResponse] = await Promise.all([
					api.get('/users/me'),
					api.get('/inquiries/my'),
				])
				const me = meResponse.data?.data || {}
				setForm((prev) => ({
					...prev,
					contactName: prev.contactName || me.name || '',
					contactEmail: prev.contactEmail || me.username || '',
				}))
				const loaded = myInquiriesResponse.data?.data || []
				setInquiries(loaded)
				setSelectedInquiryId((prev) => prev || loaded[0]?.id || null)
			} catch {
				setInquiries([])
				setSelectedInquiryId(null)
			}
		}

		preload()
	}, [isLogin])

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const reloadMyInquiries = async () => {
		if (!isLogin) return
		setLoadingList(true)
		try {
			const response = await api.get('/inquiries/my')
			const loaded = response.data?.data || []
			setInquiries(loaded)
			setSelectedInquiryId((prev) => {
				if (!loaded.length) return null
				const exists = loaded.some((item) => item.id === prev)
				return exists ? prev : loaded[0].id
			})
		} finally {
			setLoadingList(false)
		}
	}

	useEffect(() => {
		const loadMessages = async () => {
			if (!isLogin || !selectedInquiryId) {
				setMessages([])
				return
			}

			setLoadingMessages(true)
			try {
				const response = await api.get(`/inquiries/${selectedInquiryId}/messages`)
				setMessages(response.data?.data || [])
			} catch {
				setMessages([])
			} finally {
				setLoadingMessages(false)
			}
		}

		loadMessages()
	}, [isLogin, selectedInquiryId])

	const onSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')
		if (!isLogin) {
			setError('문의 등록은 로그인 후 이용 가능합니다.')
			return
		}

		setSubmitting(true)
		try {
			await api.post('/inquiries', form)
			setSuccess('문의가 정상 등록되었습니다.')
			setForm((prev) => ({
				...prev,
				title: '',
				content: '',
			}))
			await reloadMyInquiries()
		} catch (err) {
			setError(err?.response?.data?.message || '문의 등록에 실패했습니다.')
		} finally {
			setSubmitting(false)
		}
	}

	const onSendMessage = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')
		if (!isLogin) {
			setError('답장 전송은 로그인 후 이용 가능합니다.')
			return
		}
		if (!selectedInquiryId) {
			setError('문의 내역에서 항목을 먼저 선택해 주세요.')
			return
		}
		if (!newMessage.trim()) {
			setError('메시지 내용을 입력해 주세요.')
			return
		}

		setSendingMessage(true)
		try {
			await api.post(`/inquiries/${selectedInquiryId}/messages`, {
				content: newMessage.trim(),
			})
			setNewMessage('')
			setSuccess('메시지를 전송했습니다.')
			const response = await api.get(`/inquiries/${selectedInquiryId}/messages`)
			setMessages(response.data?.data || [])
			await reloadMyInquiries()
		} catch (err) {
			setError(err?.response?.data?.message || '메시지 전송에 실패했습니다.')
		} finally {
			setSendingMessage(false)
		}
	}

	return (
		<Layout>
			<section className='bg-slate-50 px-6 py-16'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-10 text-center'>
						<h1 className='text-4xl font-extrabold text-slate-900 md:text-5xl'>문의하기</h1>
						<p className='mt-3 text-slate-500'>궁금한 점을 남겨주시면 빠르게 답변드릴게요.</p>
					</div>

					<div className='grid gap-5 lg:grid-cols-[360px_1fr]'>
						<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
							<h3 className='text-xl font-bold text-slate-900'>연락처 정보</h3>
							<div className='mt-5 space-y-5 text-sm text-slate-600'>
								<div>
									<div className='text-xs font-semibold uppercase text-slate-400'>이메일</div>
									<a className='mt-1 block font-medium text-slate-700' href='mailto:thejoen@gmail.com'>thejoen@gmail.com</a>
								</div>
								<div>
									<div className='text-xs font-semibold uppercase text-slate-400'>전화번호</div>
									<a className='mt-1 block font-medium text-slate-700' href='tel:032-521-8889'>032-521-8889</a>
								</div>
								<div>
									<div className='text-xs font-semibold uppercase text-slate-400'>운영시간</div>
									<p className='mt-1'>평일 오전 9시 - 오후 6시<br />주말 및 공휴일 휴무</p>
								</div>
							</div>
							<div className='mt-5 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700'>영업일 기준 1~2일 내 답변드립니다.</div>
						</div>

						<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
							<h3 className='text-xl font-bold text-slate-900'>문의 남기기</h3>
							<form onSubmit={onSubmit} className='mt-5 grid gap-4'>
								<div className='grid gap-4 md:grid-cols-2'>
									<Input label='이름' name='contactName' value={form.contactName} onChange={onChange} required />
									<Input label='이메일' name='contactEmail' value={form.contactEmail} onChange={onChange} type='email' required />
								</div>
								<div className='grid gap-4 md:grid-cols-[1fr_180px]'>
									<Input label='연락처' name='contactPhone' value={form.contactPhone} onChange={onChange} required />
									<label className='block'>
										<span className='mb-1 block text-sm font-semibold text-slate-700'>문의 유형</span>
										<select name='category' value={form.category} onChange={onChange} className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none'>
											{categoryOptions.map((option) => (
												<option key={option.value} value={option.value}>{option.label}</option>
											))}
										</select>
									</label>
								</div>
								<Input label='문의 제목' name='title' value={form.title} onChange={onChange} required />
								<label className='block'>
									<span className='mb-1 block text-sm font-semibold text-slate-700'>문의 내용</span>
									<textarea
										name='content'
										value={form.content}
										onChange={onChange}
										rows={6}
										required
										placeholder='문의 내용을 자세히 작성해 주세요.'
										className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none'
									/>
								</label>

								{error && <p className='text-sm font-semibold text-red-500'>{error}</p>}
								{success && <p className='text-sm font-semibold text-emerald-600'>{success}</p>}

								<div className='flex flex-wrap gap-2'>
									<button type='submit' disabled={submitting} className='rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60'>
										{submitting ? '전송 중...' : '전송하기'}
									</button>
									<Link to='/guide' className='rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'>돌아가기</Link>
								</div>
							</form>
						</div>
					</div>

					<div className='mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<div className='mb-4 flex items-center justify-between'>
							<h3 className='text-lg font-bold text-slate-900'>내 문의 내역</h3>
							<button type='button' onClick={reloadMyInquiries} disabled={!isLogin || loadingList} className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'>
								{loadingList ? '불러오는 중...' : '새로고침'}
							</button>
						</div>

						{!isLogin ? (
							<p className='text-sm text-slate-500'>로그인 후 문의 내역을 확인할 수 있습니다.</p>
						) : inquiries.length === 0 ? (
							<p className='text-sm text-slate-500'>등록된 문의가 없습니다.</p>
						) : (
							<div className='space-y-2'>
								{inquiries.map((item) => (
									<button
										type='button'
										key={item.id}
										onClick={() => setSelectedInquiryId(item.id)}
										className={`w-full rounded-xl border px-4 py-3 text-left ${
											selectedInquiryId === item.id
												? 'border-[#4f46e5] bg-indigo-50'
												: 'border-slate-200 bg-slate-50'
										}`}
									>
										<div className='flex flex-wrap items-center justify-between gap-2'>
											<div className='font-semibold text-slate-800'>{item.title || '-'}</div>
											<span className='rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700'>{statusText(item.status)}</span>
										</div>
										<div className='mt-1 text-xs text-slate-500'>
											{item.category || 'INQUIRY'} · {formatDateTime(item.createdAt)}
										</div>
										{item.lastMessage && <div className='mt-1 text-sm text-slate-600'>{item.lastMessage}</div>}
									</button>
								))}
							</div>
						)}
					</div>

					<div className='mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h3 className='text-lg font-bold text-slate-900'>문의 대화</h3>
						{!isLogin ? (
							<p className='mt-3 text-sm text-slate-500'>로그인 후 문의 대화를 확인할 수 있습니다.</p>
						) : !selectedInquiryId ? (
							<p className='mt-3 text-sm text-slate-500'>문의를 선택하면 대화 내용을 볼 수 있습니다.</p>
						) : loadingMessages ? (
							<p className='mt-3 text-sm text-slate-500'>대화 내용을 불러오는 중입니다...</p>
						) : (
							<>
								<div className='mt-4 space-y-3'>
									{messages.length === 0 ? (
										<p className='text-sm text-slate-500'>등록된 메시지가 없습니다.</p>
									) : (
										messages.map((item) => {
											const isAdmin = item.senderRole === 'ADMIN'
											return (
												<div key={item.id} className={`rounded-xl px-4 py-3 ${isAdmin ? 'bg-slate-100' : 'bg-indigo-50'}`}>
													<div className='text-xs font-semibold text-slate-500'>
														{item.senderName || (isAdmin ? '관리자' : '나')} · {formatDateTime(item.createdAt)}
													</div>
													<div className='mt-1 text-sm text-slate-700'>{item.content}</div>
												</div>
											)
										})
									)}
								</div>

								<form onSubmit={onSendMessage} className='mt-4 flex flex-col gap-2'>
									<textarea
										value={newMessage}
										onChange={(event) => setNewMessage(event.target.value)}
										rows={3}
										placeholder='추가 문의 내용을 입력해 주세요.'
										className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none'
									/>
									<div>
										<button type='submit' disabled={sendingMessage} className='rounded-xl bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60'>
											{sendingMessage ? '전송 중...' : '메시지 전송'}
										</button>
									</div>
								</form>
							</>
						)}
					</div>
				</div>
			</section>
		</Layout>
	)
}

const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
	<label className='block'>
		<span className='mb-1 block text-sm font-semibold text-slate-700'>{label}</span>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none'
		/>
	</label>
)

export default Contact


