import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const EMPTY_LIST = []

const formatDate = (value, options) => {
	if (!value) return '-'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '-'
	return new Intl.DateTimeFormat('ko-KR', options).format(date)
}

const formatDateTime = (value) => formatDate(value, {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

const formatCurrency = (value) => {
	const amount = Number(value || 0)
	return `${amount.toLocaleString('ko-KR')}원`
}

const getStatusText = (status) => {
	const map = {
		CONFIRMED: '확정',
		PENDING: '대기',
		COMPLETED: '완료',
		CANCELLED: '취소',
	}
	return map[status] || status || '확인 중'
}

const TutorDashboard = () => {
	const { isLoading: authLoading, isLogin, hasRole } = useAuth()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [mypage, setMypage] = useState(null)

	useEffect(() => {
		if (authLoading) return
		if (!isLogin) {
			setLoading(false)
			return
		}

		const fetchData = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await api.get('/tutors/me')
				setMypage(response.data?.data || null)
			} catch {
				setError('대시보드 데이터를 불러오지 못했습니다.')
				setMypage(null)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [authLoading, isLogin])

	const stats = mypage?.tutorStats || {}
	const upcomingLessons = mypage?.upcomingLessons ?? EMPTY_LIST
	const tutorReviews = mypage?.tutorReviews ?? EMPTY_LIST
	const monthlyEarnings = mypage?.monthlyEarnings ?? EMPTY_LIST

	const thisWeekLessons = useMemo(() => {
		const now = new Date()
		const weekLater = new Date(now)
		weekLater.setDate(now.getDate() + 7)
		return upcomingLessons.filter((lesson) => {
			if (!lesson.startAt) return false
			const start = new Date(lesson.startAt)
			return start >= now && start <= weekLater
		})
	}, [upcomingLessons])

	const maxMonthlyEarnings = useMemo(() => {
		if (monthlyEarnings.length === 0) return 1
		return Math.max(...monthlyEarnings.map((row) => Number(row.totalEarnings || 0)), 1)
	}, [monthlyEarnings])

	if (authLoading || loading) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] items-center justify-center'>
					<div className='h-10 w-10 animate-spin rounded-full border-4 border-[#4f46e5] border-t-transparent' />
				</div>
			</Layout>
		)
	}

	if (!isLogin) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<h2 className='text-2xl font-bold text-slate-900'>로그인이 필요합니다</h2>
					<p className='text-slate-500'>튜터 대시보드를 보려면 로그인해 주세요.</p>
					<Link to='/login' className='rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'>로그인하기</Link>
				</div>
			</Layout>
		)
	}

	if (!hasRole('ROLE_TUTOR') && !hasRole('ROLE_TUTOR_PENDING')) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<h2 className='text-2xl font-bold text-slate-900'>접근 권한이 없습니다</h2>
					<p className='text-slate-500'>튜터 계정에서만 접근할 수 있습니다.</p>
					<Link to='/member/mypage' className='rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'>회원 마이페이지</Link>
				</div>
			</Layout>
		)
	}

	if (error) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<h2 className='text-2xl font-bold text-slate-900'>오류가 발생했습니다</h2>
					<p className='text-slate-500'>{error}</p>
					<button type='button' onClick={() => window.location.reload()} className='rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'>다시 시도</button>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<section className='bg-[#f8fafc] px-4 py-10'>
				<div className='mx-auto max-w-7xl space-y-6'>
					<div className='flex flex-wrap items-center justify-between gap-3'>
						<div>
							<h1 className='text-2xl font-extrabold text-slate-900'>튜터 대시보드</h1>
							<p className='mt-1 text-sm text-slate-500'>이번 주 수업과 월별 수익을 한눈에 확인합니다.</p>
						</div>
						<div className='flex gap-2'>
							<Link to='/tutor/mypage' className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>마이페이지</Link>
							<Link to='/tutor/profile-edit' className='rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]'>프로필 수정</Link>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
						<KpiCard label='총 수업' value={`${stats.totalLessons ?? 0}회`} />
						<KpiCard label='활성 학생' value={`${stats.activeStudents ?? 0}명`} />
						<KpiCard label='누적 수익' value={formatCurrency(stats.totalEarnings)} />
						<KpiCard label='평점' value={`${Number(stats.ratingAvg || 0).toFixed(1)} / 5.0`} />
					</div>

					<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]'>
						<div className='space-y-6'>
							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<div className='mb-4 flex items-center justify-between'>
									<h2 className='text-lg font-bold text-slate-900'>이번 주 예정 수업</h2>
									<span className='text-sm font-semibold text-[#4f46e5]'>{thisWeekLessons.length}건</span>
								</div>
								{thisWeekLessons.length === 0 ? (
									<p className='py-8 text-center text-sm text-slate-400'>이번 주 예정 수업이 없습니다.</p>
								) : (
									<div className='space-y-3'>
										{thisWeekLessons.slice(0, 8).map((lesson) => (
											<div key={lesson.bookingId} className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
												<div className='flex items-start justify-between gap-3'>
													<div>
														<div className='font-semibold text-slate-900'>{lesson.subject || '수업'}</div>
														<div className='text-sm text-slate-500'>{lesson.studentName || '-'} 학생</div>
													</div>
													<div className='text-xs font-semibold text-slate-500'>{getStatusText(lesson.status)}</div>
												</div>
												<div className='mt-2 text-sm text-slate-600'>{formatDateTime(lesson.startAt)}</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<div className='mb-4 flex items-center justify-between'>
									<h2 className='text-lg font-bold text-slate-900'>월별 수익</h2>
									<span className='text-sm text-slate-500'>최근 {monthlyEarnings.length}개월</span>
								</div>
								{monthlyEarnings.length === 0 ? (
									<p className='py-8 text-center text-sm text-slate-400'>수익 데이터가 없습니다.</p>
								) : (
									<div className='space-y-3'>
										{monthlyEarnings.map((row) => {
											const amount = Number(row.totalEarnings || 0)
											const widthPercent = Math.max(8, Math.round((amount / maxMonthlyEarnings) * 100))
											return (
												<div key={row.yearMonth}>
													<div className='mb-1 flex items-center justify-between text-sm'>
														<span className='font-medium text-slate-700'>{row.yearMonth}</span>
														<span className='font-semibold text-indigo-700'>{formatCurrency(amount)}</span>
													</div>
													<div className='h-2 rounded-full bg-slate-100'>
														<div className='h-2 rounded-full bg-[#4f46e5]' style={{ width: `${widthPercent}%` }} />
													</div>
													<div className='mt-1 text-xs text-slate-400'>수업 {row.lessonCount ?? 0}회 · 평균 {formatCurrency(row.avgLessonPrice)}</div>
												</div>
											)
										})}
									</div>
								)}
							</div>
						</div>

						<aside className='space-y-6'>
							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<h2 className='mb-4 text-lg font-bold text-slate-900'>최근 리뷰</h2>
								{tutorReviews.length === 0 ? (
									<p className='text-sm text-slate-400'>아직 리뷰가 없습니다.</p>
								) : (
									<div className='space-y-3'>
										{tutorReviews.slice(0, 4).map((review) => (
											<div key={review.reviewId} className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
												<div className='flex items-center justify-between text-sm'>
													<span className='font-semibold text-slate-800'>{review.studentName || '익명'}</span>
													<span className='text-amber-500'>{'★'.repeat(Number(review.rating || 0))}{'☆'.repeat(5 - Number(review.rating || 0))}</span>
												</div>
												{review.content && <p className='mt-1 text-sm text-slate-600'>{review.content}</p>}
											</div>
										))}
									</div>
								)}
							</div>

							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<h2 className='mb-2 text-lg font-bold text-slate-900'>빠른 이동</h2>
								<div className='grid gap-2'>
									<Link to='/tutor/mypage' className='rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>마이페이지</Link>
									<Link to='/tutor/profile-edit' className='rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>프로필 수정</Link>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</section>
		</Layout>
	)
}

const KpiCard = ({ label, value }) => (
	<div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
		<div className='text-xs font-semibold uppercase tracking-wide text-slate-400'>{label}</div>
		<div className='mt-2 text-xl font-extrabold text-slate-900'>{value}</div>
	</div>
)

export default TutorDashboard


