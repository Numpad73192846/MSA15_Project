﻿import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenCheck, CalendarClock, CircleDollarSign, MessageSquareText, PencilLine } from 'lucide-react'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const tabItems = [
	{ key: 'bookings', label: '예약 내역' },
	{ key: 'reviews', label: '내 리뷰' },
	{ key: 'schedule', label: '주간 스케줄' },
]

const EMPTY_LIST = []

const formatDate = (value, options) => {
	if (!value) return '-'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '-'
	return new Intl.DateTimeFormat('ko-KR', options).format(date)
}

const formatDateTime = (value) => formatDate(value, {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

const formatCurrency = (value) => {
	const amount = Number(value || 0)
	return `${amount.toLocaleString('ko-KR')}원`
}

const getWeekStart = (baseDate) => {
	const date = new Date(baseDate)
	date.setHours(0, 0, 0, 0)
	date.setDate(date.getDate() - date.getDay())
	return date
}

const isSameDay = (left, right) => (
	left.getFullYear() === right.getFullYear()
	&& left.getMonth() === right.getMonth()
	&& left.getDate() === right.getDate()
)

const BookingCard = ({ booking, compact = false }) => (
	<div className={`rounded-2xl border border-slate-200 bg-white ${compact ? 'p-3' : 'p-4'}`}>
		<div className='flex flex-wrap items-start justify-between gap-3'>
			<div>
				<div className='text-base font-bold text-slate-900'>{booking.subject || '수업'}</div>
				<div className='mt-1 text-sm text-slate-500'>{booking.tutorName || '튜터 정보 없음'}</div>
			</div>
			<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>{booking.status || '상태 확인 중'}</span>
		</div>
		<div className='mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2'>
			<div>일시: {formatDateTime(booking.startAt)}</div>
			<div>수업료: {formatCurrency(booking.price)}</div>
			<div>종료: {formatDate(booking.endAt, { hour: '2-digit', minute: '2-digit' })}</div>
			<div>
				줌 링크:{' '}
				{booking.zoomJoinUrl ? (
					<a href={booking.zoomJoinUrl} target='_blank' rel='noreferrer' className='font-semibold text-[#4f46e5] hover:underline'>입장하기</a>
				) : '미등록'}
			</div>
		</div>
	</div>
)

const MemberMyPage = () => {
	const { isLoading: authLoading, isLogin } = useAuth()
	const [activeTab, setActiveTab] = useState('bookings')
	const [weekOffset, setWeekOffset] = useState(0)
	const [mypage, setMypage] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [payLoading, setPayLoading] = useState(false)
	const [payMessage, setPayMessage] = useState('')
	const [payError, setPayError] = useState('')

	const loadMypage = useCallback(async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.get('/users/me/mypage')
			setMypage(response.data?.data || null)
		} catch {
			setError('마이페이지 정보를 불러오지 못했습니다.')
			setMypage(null)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (authLoading) {
			return
		}

		if (!isLogin) {
			setLoading(false)
			return
		}

		loadMypage()
	}, [authLoading, isLogin, loadMypage])

	const handlePayAll = async () => {
		setPayMessage('')
		setPayError('')
		setPayLoading(true)
		try {
			const response = await api.post('/bookings/pay-all', { paymentMethod: 'CARD' })
			const result = response.data?.data || {}
			const targetCount = Number(result.targetCount || 0)
			const successCount = Number(result.successCount || 0)
			const failedCount = Number(result.failedCount || 0)
			if (targetCount === 0) {
				setPayMessage('결제 가능한 예정 수업이 없습니다.')
			} else if (failedCount === 0) {
				setPayMessage(`총 ${successCount}건 결제가 완료되었습니다.`)
			} else {
				setPayError(`총 ${targetCount}건 중 ${successCount}건 결제 완료, ${failedCount}건 실패했습니다.`)
			}
			await loadMypage()
		} catch (err) {
			setPayError(err?.response?.data?.message || '통합 결제에 실패했습니다.')
		} finally {
			setPayLoading(false)
		}
	}

	const stats = mypage?.memberStats || {}
	const upcomingBookings = mypage?.upcomingBookings ?? EMPTY_LIST
	const pastBookings = mypage?.pastBookings ?? EMPTY_LIST
	const studentReviews = mypage?.studentReviews ?? EMPTY_LIST
	const tutorMessages = mypage?.tutorMessages ?? EMPTY_LIST

	const currentWeekStart = useMemo(() => {
		const today = new Date()
		today.setDate(today.getDate() + weekOffset * 7)
		return getWeekStart(today)
	}, [weekOffset])

	const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
		const date = new Date(currentWeekStart)
		date.setDate(currentWeekStart.getDate() + index)
		return date
	}), [currentWeekStart])

	const weeklyBookings = useMemo(() => weekDays.map((day) => ({
		day,
		items: upcomingBookings.filter((booking) => {
			if (!booking.startAt) return false
			const bookingDate = new Date(booking.startAt)
			return isSameDay(bookingDate, day)
		}).sort((left, right) => new Date(left.startAt) - new Date(right.startAt)),
	})), [upcomingBookings, weekDays])

	const profileInitial = (mypage?.name || mypage?.nickname || '회').charAt(0)
	const hasPayableBookings = upcomingBookings.some((booking) => booking.status === 'CONFIRMED' && !booking.paidAt)

	return (
		<Layout>
			<section className='bg-[#f8fafc] px-4 py-10'>
				<div className='mx-auto max-w-7xl'>
					<div className='mb-6'>
						<h1 className='flex items-center gap-3 text-3xl font-bold text-slate-900'>
							<BookOpenCheck className='h-8 w-8 text-[#4f46e5]' strokeWidth={2} />
							<span>마이페이지</span>
						</h1>
						<p className='mt-2 text-slate-500'>프로필과 학습 내역을 관리하세요</p>
					</div>

					{authLoading || loading ? (
						<div className='rounded-3xl bg-white py-20 text-center text-slate-500 shadow-sm ring-1 ring-slate-200'>마이페이지를 불러오는 중입니다...</div>
					) : !isLogin ? (
						<div className='rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200'>
							<h2 className='text-2xl font-bold text-slate-900'>로그인이 필요합니다</h2>
							<p className='mt-2 text-slate-500'>회원 전용 마이페이지는 로그인 후 이용할 수 있습니다.</p>
							<Link to='/login' className='mt-6 inline-flex rounded-full bg-[#4f46e5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4338ca]'>로그인하러 가기</Link>
						</div>
					) : error || !mypage ? (
						<div className='rounded-3xl bg-white px-6 py-16 text-center text-slate-500 shadow-sm ring-1 ring-slate-200'>{error || '마이페이지 정보를 찾을 수 없습니다.'}</div>
					) : (
						<div className='grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]'>
							<div className='space-y-4'>
								<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
									<div className='text-center'>
										<div className='mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sky-500 text-3xl font-bold text-white'>
											{mypage.profileImg ? <img src={mypage.profileImg} alt='프로필 이미지' className='h-full w-full object-cover' /> : profileInitial}
										</div>
										<h2 className='mt-4 text-2xl font-bold text-slate-900'>{mypage.name || '회원'}</h2>
										<p className='mt-1 text-sm text-slate-500'>{mypage.email || '-'}</p>
										<div className='mt-4'>
											<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>회원</span>
										</div>
										<div className='mt-5 space-y-2'>
											<Link to='/member/profile-edit' className='inline-flex w-full items-center justify-center rounded-xl border border-[#4f46e5] px-4 py-3 text-sm font-semibold text-[#4f46e5] transition hover:bg-indigo-50'>회원정보 수정</Link>
											<Link to='/tutors' className='inline-flex w-full items-center justify-center rounded-xl bg-[#4f46e5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4338ca]'>튜터 찾기</Link>
										</div>
									</div>
								</div>

								<div className='rounded-3xl border border-[#4f46e5] bg-white p-5 shadow-sm'>
									<div className='mb-3 text-lg font-bold text-slate-900'>내 수업</div>
									{upcomingBookings.length === 0 ? (
										<div className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>예정된 수업이 없습니다.</div>
									) : (
										<div className='space-y-3'>
											{upcomingBookings.slice(0, 2).map((booking) => <BookingCard key={booking.bookingId} booking={booking} compact />)}
										</div>
									)}
								</div>
							</div>

							<div className='space-y-6'>
								<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
									<div className='rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200'>
										<div className='mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-indigo-50'>
											<CalendarClock className='h-10 w-10 text-[#4f46e5]' strokeWidth={1.8} />
										</div>
										<div className='mt-3 text-3xl font-bold text-[#4f46e5]'>{stats.upcomingLessons || 0}</div>
										<div className='mt-1 text-sm text-slate-500'>예정된 수업</div>
									</div>
									<div className='rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200'>
										<div className='mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-emerald-50'>
											<BookOpenCheck className='h-10 w-10 text-emerald-600' strokeWidth={1.8} />
										</div>
										<div className='mt-3 text-3xl font-bold text-emerald-600'>{stats.completedLessons || 0}</div>
										<div className='mt-1 text-sm text-slate-500'>완료한 수업</div>
									</div>
									<div className='rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200'>
										<div className='mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-amber-50'>
											<PencilLine className='h-10 w-10 text-amber-600' strokeWidth={1.8} />
										</div>
										<div className='mt-3 text-3xl font-bold text-amber-600'>{stats.totalReviews || 0}</div>
										<div className='mt-1 text-sm text-slate-500'>작성한 리뷰</div>
									</div>
									<div className='rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200'>
										<div className='mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-sky-50'>
											<CircleDollarSign className='h-10 w-10 text-sky-600' strokeWidth={1.8} />
										</div>
										<div className='mt-3 text-3xl font-bold text-sky-600'>{formatCurrency(stats.totalSpent)}</div>
										<div className='mt-1 text-sm text-slate-500'>총 결제 금액</div>
									</div>
								</div>

								<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
									<div className='flex items-center justify-between gap-3'>
										<div>
											<h3 className='flex items-center gap-2 text-lg font-bold text-slate-900'>
												<MessageSquareText className='h-5 w-5 text-[#4f46e5]' strokeWidth={1.8} />
												<span>튜터 메시지</span>
											</h3>
											<p className='mt-1 text-sm text-slate-500'>최근 받은 수업 관련 메시지를 확인하세요.</p>
										</div>
										<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>{tutorMessages.length}개</span>
									</div>
									<div className='mt-4 space-y-3'>
										{tutorMessages.length === 0 ? (
											<div className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>메시지가 없습니다.</div>
										) : tutorMessages.slice(0, 4).map((message) => (
											<div key={message.id} className='rounded-2xl border border-slate-200 p-4'>
												<div className='flex items-start justify-between gap-3'>
													<div>
														<div className='font-bold text-slate-900'>{message.tutorName || '튜터'}</div>
														<div className='mt-1 text-sm text-slate-500'>{message.subject || '수업 문의'}</div>
													</div>
													<div className='text-xs text-slate-400'>{formatDate(message.createdAt, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
												</div>
												<p className='mt-3 text-sm leading-6 text-slate-600'>{message.content}</p>
											</div>
										))}
									</div>
								</div>

								<div className='rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200'>
									<div className='flex items-center justify-between gap-3'>
										<div>
											<h3 className='text-lg font-bold text-slate-900'>AI 수업 요약</h3>
											<p className='mt-1 text-sm text-slate-500'>Zoom 수업 내용을 입력하면 요약 포맷으로 정리해드립니다.</p>
										</div>
										<button type='button' className='rounded-full border border-[#4f46e5] px-4 py-2 text-sm font-semibold text-[#4f46e5] transition hover:bg-indigo-50'>AI 수업 요약 작성</button>
									</div>
								</div>

								<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
									<div className='mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-4'>
										{tabItems.map((tab) => (
											<button key={tab.key} type='button' onClick={() => setActiveTab(tab.key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
												{tab.label}
											</button>
										))}
									</div>

									{activeTab === 'bookings' && (
										<div className='space-y-6'>
											<div>
												<div className='mb-3 flex items-center justify-between gap-3'>
													<h3 className='text-lg font-bold text-slate-900'>예정된 수업</h3>
													<button
														type='button'
														onClick={handlePayAll}
														disabled={payLoading || !hasPayableBookings}
														className='rounded-full bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60'
													>
														{payLoading ? '결제 처리 중...' : '튜터 통합 결제'}
													</button>
												</div>
												{payError && <p className='mb-3 text-sm font-semibold text-red-500'>{payError}</p>}
												{payMessage && <p className='mb-3 text-sm font-semibold text-emerald-600'>{payMessage}</p>}
												<div className='space-y-3'>
													{upcomingBookings.length === 0 ? <div className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>예정된 수업이 없습니다.</div> : upcomingBookings.map((booking) => <BookingCard key={booking.bookingId} booking={booking} />)}
												</div>
											</div>

											<div>
												<h3 className='mb-3 text-lg font-bold text-slate-900'>지난 수업</h3>
												<div className='space-y-3'>
													{pastBookings.length === 0 ? <div className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>지난 수업이 없습니다.</div> : pastBookings.map((booking) => <BookingCard key={booking.bookingId} booking={booking} />)}
												</div>
											</div>
										</div>
									)}

									{activeTab === 'reviews' && (
										<div>
											<h3 className='mb-3 text-lg font-bold text-slate-900'>내가 작성한 리뷰</h3>
											{studentReviews.length === 0 ? (
												<div className='rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>작성한 리뷰가 없습니다.</div>
											) : (
												<div className='space-y-4'>
													{studentReviews.map((review) => (
														<div key={review.reviewId} className='rounded-2xl border border-slate-200 p-5'>
															<div className='flex flex-wrap items-start justify-between gap-3'>
																<div>
																	<div className='text-lg font-bold text-slate-900'>{review.tutorName || '튜터'}</div>
																	<div className='mt-1 text-sm text-slate-500'>{formatDateTime(review.createdAt)}</div>
																</div>
																<div className='text-amber-400'>{Array.from({ length: 5 }, (_, index) => index < (review.rating || 0) ? '★' : '☆').join('')}</div>
															</div>
															<p className='mt-4 text-sm leading-6 text-slate-600'>{review.content}</p>
														</div>
													))}
												</div>
											)}
										</div>
									)}

									{activeTab === 'schedule' && (
										<div>
											<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
												<div>
													<h3 className='text-lg font-bold text-slate-900'>주간 스케줄</h3>
													<p className='mt-1 text-sm text-slate-500'>예정된 수업을 주간 기준으로 확인할 수 있습니다.</p>
												</div>
												<div className='flex items-center gap-2'>
													<button type='button' onClick={() => setWeekOffset((prev) => prev - 1)} className='rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100'>이전 주</button>
													<div className='rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700'>
														{formatDate(weekDays[0], { month: 'numeric', day: 'numeric' })} - {formatDate(weekDays[6], { month: 'numeric', day: 'numeric' })}
													</div>
													<button type='button' onClick={() => setWeekOffset((prev) => prev + 1)} className='rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100'>다음 주</button>
												</div>
											</div>
											<div className='grid gap-3 lg:grid-cols-7'>
												{weeklyBookings.map(({ day, items }) => (
													<div key={day.toISOString()} className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
														<div className='mb-3 border-b border-slate-200 pb-2'>
															<div className='text-sm font-bold text-slate-900'>{formatDate(day, { weekday: 'short' })}</div>
															<div className='text-xs text-slate-500'>{formatDate(day, { month: 'numeric', day: 'numeric' })}</div>
														</div>
														<div className='space-y-2'>
															{items.length === 0 ? (
																<div className='rounded-xl bg-white px-3 py-4 text-center text-xs text-slate-400'>예약 없음</div>
															) : items.map((booking) => (
																<div key={booking.bookingId} className='rounded-xl bg-white p-3 text-xs shadow-sm ring-1 ring-slate-200'>
																	<div className='font-bold text-slate-900'>{booking.tutorName}</div>
																	<div className='mt-1 text-slate-600'>{booking.subject}</div>
																	<div className='mt-2 font-medium text-red-500'>● {formatDate(booking.startAt, { hour: '2-digit', minute: '2-digit' })}</div>
																</div>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</Layout>
	)
}

export default MemberMyPage


