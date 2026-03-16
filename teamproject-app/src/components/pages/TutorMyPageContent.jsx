import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const tabItems = [
	{ key: 'upcoming', label: '예정 수업' },
	{ key: 'past', label: '지난 수업' },
	{ key: 'reviews', label: '수강생 리뷰' },
	{ key: 'earnings', label: '수익 현황' },
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

const StarRating = ({ rating = 0 }) => (
	<div className='flex items-center gap-1'>
		{[1, 2, 3, 4, 5].map((star) => (
			<span key={star} className={star <= rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
		))}
		<span className='ml-1 text-sm font-semibold text-slate-700'>{Number(rating || 0).toFixed(1)}</span>
	</div>
)

const statusBadge = (status) => {
	const map = {
		CONFIRMED: { label: '확정', color: 'bg-green-100 text-green-700' },
		PENDING:   { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
		CANCELLED: { label: '취소', color: 'bg-red-100 text-red-700' },
		COMPLETED: { label: '완료', color: 'bg-slate-100 text-slate-600' },
	}
	const info = map[status] ?? { label: status || '확인 중', color: 'bg-slate-100 text-slate-600' }
	return (
		<span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.color}`}>{info.label}</span>
	)
}

const LessonCard = ({ lesson, compact = false }) => (
	<div className={`rounded-2xl border border-slate-200 bg-white ${compact ? 'p-3' : 'p-4'}`}>
		<div className='flex flex-wrap items-start justify-between gap-2'>
			<div>
				<div className='text-base font-bold text-slate-900'>{lesson.subject || '수업'}</div>
				<div className='mt-0.5 text-sm text-slate-500'>학생: {lesson.studentName || '-'}</div>
			</div>
			{statusBadge(lesson.status)}
		</div>
		<div className='mt-3 grid gap-1.5 text-sm text-slate-600 sm:grid-cols-2'>
			<div>시작: {formatDateTime(lesson.startAt)}</div>
			<div>종료: {formatDate(lesson.endAt, { hour: '2-digit', minute: '2-digit' })}</div>
			<div>수업료: {formatCurrency(lesson.price)}</div>
			<div>수업 시간: {lesson.durationHours ? `${lesson.durationHours}시간` : '-'}</div>
		</div>
	</div>
)

const TutorMyPage = () => {
	const { isLoading: authLoading, isLogin, hasRole } = useAuth()
	const [activeTab, setActiveTab] = useState('upcoming')
	const [mypage, setMypage] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		if (authLoading) {
			return
		}

		if (!isLogin) {
			setLoading(false)
			return
		}

		const fetchMypage = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await api.get('/tutors/me')
				setMypage(response.data?.data || null)
			} catch {
				setError('튜터 마이페이지 정보를 불러오지 못했습니다.')
				setMypage(null)
			} finally {
				setLoading(false)
			}
		}

		fetchMypage()
	}, [authLoading, isLogin])

	const upcomingLessons = mypage?.upcomingLessons ?? EMPTY_LIST
	const pastLessons = mypage?.pastLessons ?? EMPTY_LIST
	const tutorReviews = mypage?.tutorReviews ?? EMPTY_LIST
	const monthlyEarnings = mypage?.monthlyEarnings ?? EMPTY_LIST
	const languageFields = mypage?.languageFields ?? EMPTY_LIST

	const stats = useMemo(() => ({
		totalLessons: mypage?.tutorStats?.totalLessons ?? 0,
		totalEarnings: mypage?.tutorStats?.totalEarnings ?? 0,
		activeStudents: mypage?.tutorStats?.activeStudents ?? 0,
		ratingAvg: mypage?.tutorStats?.ratingAvg ?? mypage?.tutorProfile?.ratingAvg ?? 0,
		reviewCount: mypage?.tutorStats?.reviewCount ?? mypage?.tutorProfile?.reviewCount ?? 0,
	}), [mypage])

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
					<div className='text-5xl'>??</div>
					<h2 className='text-2xl font-bold text-slate-900'>로그인이 필요합니다</h2>
					<p className='text-slate-500'>튜터 마이페이지를 이용하려면 로그인 후 접근해 주세요.</p>
					<Link to='/login' className='mt-2 rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'>
						로그인하기
					</Link>
				</div>
			</Layout>
		)
	}

	if (!hasRole('ROLE_TUTOR') && !hasRole('ROLE_TUTOR_PENDING')) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<div className='text-5xl'>??</div>
					<h2 className='text-2xl font-bold text-slate-900'>접근 권한이 없습니다</h2>
					<p className='text-slate-500'>튜터 마이페이지는 튜터 계정에서만 이용 가능합니다.</p>
					<Link to='/member/mypage' className='mt-2 rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'>
						회원 마이페이지로
					</Link>
				</div>
			</Layout>
		)
	}

	if (error) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<div className='text-5xl'>??</div>
					<h2 className='text-2xl font-bold text-slate-900'>오류가 발생했습니다</h2>
					<p className='text-slate-500'>{error}</p>
					<button
						type='button'
						onClick={() => window.location.reload()}
						className='mt-2 rounded-xl bg-[#4f46e5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca]'
					>
						다시 시도
					</button>
				</div>
			</Layout>
		)
	}

	const profile = mypage?.tutorProfile

	return (
		<Layout>
			<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
				{/* 페이지 헤더 */}
				<div className='mb-8'>
					<h1 className='text-2xl font-extrabold text-slate-900'>튜터 마이페이지</h1>
					<p className='mt-1 text-sm text-slate-500'>수업 현황 및 튜터 프로필을 관리합니다.</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-[300px_1fr]'>
					{/* ── 왼쪽 컬럼 ── */}
					<aside className='flex flex-col gap-4'>
						{/* 프로필 카드 */}
						<div className='rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm'>
							<div className='mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-indigo-100'>
								{profile?.profileImg ? (
									<img
										src={profile.profileImg}
										alt='프로필'
										className='h-full w-full object-cover'
									/>
								) : (
									<div className='flex h-full w-full items-center justify-center text-4xl'>?????</div>
								)}
							</div>

							<h2 className='text-lg font-bold text-slate-900'>{profile?.name || '-'}</h2>
							{profile?.headline && (
								<p className='mt-1 text-sm text-slate-500'>{profile.headline}</p>
							)}

							<div className='mt-2 flex items-center justify-center gap-2'>
								{profile?.verified ? (
									<span className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700'>? 인증 튜터</span>
								) : (
									<span className='rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700'>승인 대기</span>
								)}
							</div>

							<div className='mt-3 flex justify-center'>
								<StarRating rating={stats.ratingAvg} />
							</div>
							<div className='mt-0.5 text-xs text-slate-400'>리뷰 {stats.reviewCount}개</div>

							{/* 언어 분야 */}
							{languageFields.length > 0 && (
								<div className='mt-4 flex flex-wrap justify-center gap-1.5'>
									{languageFields.map((field) => (
										<span
											key={field.id}
											className='rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700'
										>
											{field.name}
										</span>
									))}
								</div>
							)}

							<div className='mt-4 text-sm text-slate-500'>{profile?.email || '-'}</div>

							<div className='mt-4 flex flex-col gap-2'>
								<Link
									to='/tutor/profile-edit'
									className='w-full rounded-xl bg-[#4f46e5] py-2 text-sm font-semibold text-white hover:bg-[#4338ca]'
								>
									프로필 수정
								</Link>
								<Link
									to='/tutor/dashboard'
									className='w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
								>
									대시보드
								</Link>
							</div>
						</div>

						{/* 오늘의 예정 수업 요약 */}
						{upcomingLessons.length > 0 && (
							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<h3 className='mb-3 font-bold text-slate-800'>다가오는 수업</h3>
								<div className='flex flex-col gap-2'>
									{upcomingLessons.slice(0, 2).map((lesson) => (
										<LessonCard key={lesson.bookingId} lesson={lesson} compact />
									))}
									{upcomingLessons.length > 2 && (
										<button
											type='button'
											onClick={() => setActiveTab('upcoming')}
											className='text-center text-xs font-semibold text-[#4f46e5] hover:underline'
										>
											+ {upcomingLessons.length - 2}개 더 보기
										</button>
									)}
								</div>
							</div>
						)}
					</aside>

					{/* ── 오른쪽 컬럼 ── */}
					<div className='flex flex-col gap-6'>
						{/* 통계 카드 4개 */}
						<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
							<StatCard label='총 수업' value={stats.totalLessons} unit='회' color='indigo' />
							<StatCard label='활성 학생' value={stats.activeStudents} unit='명' color='emerald' />
							<StatCard label='누적 수익' value={formatCurrency(stats.totalEarnings)} color='amber' />
							<StatCard label='평점' value={Number(stats.ratingAvg || 0).toFixed(1)} unit='/ 5.0' color='rose' />
						</div>

						{/* 탭 패널 */}
						<div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
							{/* 탭 헤더 */}
							<div className='flex border-b border-slate-200'>
								{tabItems.map((tab) => (
									<button
										key={tab.key}
										type='button'
										onClick={() => setActiveTab(tab.key)}
										className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
											activeTab === tab.key
												? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
												: 'text-slate-500 hover:text-slate-800'
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>

							{/* 탭 콘텐츠 */}
							<div className='p-5'>
								{/* 예정 수업 탭 */}
								{activeTab === 'upcoming' && (
									<div className='flex flex-col gap-3'>
										{upcomingLessons.length === 0 ? (
											<EmptyState message='예정된 수업이 없습니다.' />
										) : (
											upcomingLessons.map((lesson) => (
												<LessonCard key={lesson.bookingId} lesson={lesson} />
											))
										)}
									</div>
								)}

								{/* 지난 수업 탭 */}
								{activeTab === 'past' && (
									<div className='flex flex-col gap-3'>
										{pastLessons.length === 0 ? (
											<EmptyState message='지난 수업 내역이 없습니다.' />
										) : (
											pastLessons.map((lesson) => (
												<LessonCard key={lesson.bookingId} lesson={lesson} />
											))
										)}
									</div>
								)}

								{/* 수강생 리뷰 탭 */}
								{activeTab === 'reviews' && (
									<div className='flex flex-col gap-4'>
										{tutorReviews.length === 0 ? (
											<EmptyState message='아직 받은 리뷰가 없습니다.' />
										) : (
											tutorReviews.map((review) => (
												<div key={review.reviewId} className='rounded-xl border border-slate-100 bg-slate-50 p-4'>
													<div className='flex items-start justify-between gap-2'>
														<div className='font-semibold text-slate-800'>{review.studentName || '익명'}</div>
														<StarRating rating={review.rating} />
													</div>
													{review.content && (
														<p className='mt-2 text-sm text-slate-600'>{review.content}</p>
													)}
													<div className='mt-2 text-xs text-slate-400'>
														{formatDate(review.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
													</div>
												</div>
											))
										)}
									</div>
								)}

								{/* 수익 현황 탭 */}
								{activeTab === 'earnings' && (
									<div className='flex flex-col gap-3'>
										{monthlyEarnings.length === 0 ? (
											<EmptyState message='수익 데이터가 없습니다.' />
										) : (
											<>
												<div className='overflow-x-auto'>
													<table className='w-full text-sm'>
														<thead>
															<tr className='border-b border-slate-200 text-left text-slate-500'>
																<th className='pb-2 font-semibold'>월</th>
																<th className='pb-2 font-semibold'>수업 수</th>
																<th className='pb-2 font-semibold'>총 시간</th>
																<th className='pb-2 font-semibold'>수익</th>
																<th className='pb-2 font-semibold'>평균 단가</th>
															</tr>
														</thead>
														<tbody>
															{monthlyEarnings.map((row) => (
																<tr key={row.yearMonth} className='border-b border-slate-100 last:border-0'>
																	<td className='py-2.5 font-medium text-slate-800'>{row.yearMonth}</td>
																	<td className='py-2.5 text-slate-600'>{row.lessonCount ?? '-'}회</td>
																	<td className='py-2.5 text-slate-600'>{row.totalHours ? `${Number(row.totalHours).toFixed(1)}h` : '-'}</td>
																	<td className='py-2.5 font-semibold text-indigo-700'>{formatCurrency(row.totalEarnings)}</td>
																	<td className='py-2.5 text-slate-600'>{formatCurrency(row.avgLessonPrice)}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
												<div className='mt-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm'>
													<span className='font-semibold text-indigo-700'>누적 총 수익: </span>
													<span className='text-slate-700'>{formatCurrency(stats.totalEarnings)}</span>
												</div>
											</>
										)}
									</div>
								)}
							</div>
						</div>

						{/* 자기소개 카드 */}
						{profile?.selfIntro && (
							<div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
								<h3 className='mb-2 font-bold text-slate-800'>자기소개</h3>
								<p className='whitespace-pre-wrap text-sm text-slate-600'>{profile.selfIntro}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

const StatCard = ({ label, value, unit, color }) => {
	const colorMap = {
		indigo: 'bg-indigo-50 text-indigo-700',
		emerald: 'bg-emerald-50 text-emerald-700',
		amber: 'bg-amber-50 text-amber-700',
		rose: 'bg-rose-50 text-rose-700',
	}
	return (
		<div className={`rounded-2xl p-4 ${colorMap[color] ?? 'bg-slate-50 text-slate-700'}`}>
			<div className='text-xs font-medium opacity-70'>{label}</div>
			<div className='mt-1 text-xl font-extrabold'>
				{value}
				{unit && <span className='ml-1 text-sm font-medium opacity-60'>{unit}</span>}
			</div>
		</div>
	)
}

const EmptyState = ({ message }) => (
	<div className='py-10 text-center text-slate-400'>
		<div className='text-3xl'>??</div>
		<p className='mt-2 text-sm'>{message}</p>
	</div>
)

export default TutorMyPage


