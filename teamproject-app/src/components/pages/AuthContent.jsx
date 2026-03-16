import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import useAuth from '../../utils/hooks/useAuth'
import api from '../../services/api'

const initialSignupState = {
	username: '',
	nickname: '',
	name: '',
	password: '',
	passwordCheck: '',
	role: 'ROLE_USER',
}

const Auth = ({ initialTab = 'login' }) => {
	const navigate = useNavigate()
	const { login, isLoading } = useAuth()
	const [activeTab, setActiveTab] = useState(initialTab)
	const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false, rememberId: false })
	const [signupForm, setSignupForm] = useState(initialSignupState)
	const [checkedState, setCheckedState] = useState({ username: false, nickname: false })
	const [fieldErrors, setFieldErrors] = useState({})
	const [authError, setAuthError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		setActiveTab(initialTab)
	}, [initialTab])

	useEffect(() => {
		const rememberedUsername = localStorage.getItem('rememberedUsername')
		if (rememberedUsername) {
			setLoginForm((prev) => ({
				...prev,
				username: rememberedUsername,
				rememberId: true,
			}))
		}
	}, [])

	const updateLoginField = (event) => {
		const { name, type, checked, value } = event.target
		setLoginForm((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	const updateSignupField = (event) => {
		const { name, value } = event.target
		setSignupForm((prev) => ({
			...prev,
			[name]: value,
		}))
		if (name === 'username' || name === 'nickname') {
			setCheckedState((prev) => ({ ...prev, [name]: false }))
		}
		setFieldErrors((prev) => ({ ...prev, [name]: '' }))
	}

	const validateFields = async (fields) => {
		const response = await api.post(`/users/validate?fields=${fields.join(',')}`, signupForm)
		const data = response.data
		const errors = data?.data || {}
		setFieldErrors((prev) => ({ ...prev, ...errors }))
		return errors
	}

	const checkDuplicate = async (type) => {
		const value = signupForm[type]
		if (!value.trim()) {
			setFieldErrors((prev) => ({ ...prev, [type]: `${type === 'username' ? '아이디' : '닉네임'}를 입력해주세요.` }))
			return false
		}

		const validationErrors = await validateFields([type])
		if (validationErrors[type]) {
			setCheckedState((prev) => ({ ...prev, [type]: false }))
			return false
		}

		const endpoint = type === 'username'
			? `/users/check-username?username=${encodeURIComponent(value)}`
			: `/users/check-nickname?nickname=${encodeURIComponent(value)}`

		try {
			const response = await api.get(endpoint)
			const available = response.data?.data === true
			setCheckedState((prev) => ({ ...prev, [type]: available }))
			setFieldErrors((prev) => ({
				...prev,
				[type]: available
					? `사용 가능한 ${type === 'username' ? '아이디' : '닉네임'}입니다.`
					: `이미 존재하는 ${type === 'username' ? '아이디' : '닉네임'}입니다.`
			}))
			return available
		} catch {
			setCheckedState((prev) => ({ ...prev, [type]: false }))
			setFieldErrors((prev) => ({
				...prev,
				[type]: `${type === 'username' ? '아이디' : '닉네임'} 중복 확인 중 오류가 발생했습니다.`,
			}))
			return false
		}
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		setAuthError('')
		setIsSubmitting(true)

		try {
			await login(loginForm.username, loginForm.password, loginForm.rememberMe)
			if (loginForm.rememberId) {
				localStorage.setItem('rememberedUsername', loginForm.username)
			} else {
				localStorage.removeItem('rememberedUsername')
			}
		} catch (error) {
			setAuthError(error.response?.data?.message || error.message || '로그인에 실패했습니다.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSignup = async (event) => {
		event.preventDefault()
		setAuthError('')
		setIsSubmitting(true)

		if (!checkedState.username || !checkedState.nickname) {
			setAuthError('아이디와 닉네임 중복 확인을 완료해주세요.')
			setIsSubmitting(false)
			return
		}

		const errors = await validateFields(['username', 'nickname', 'name', 'password', 'passwordCheck'])
		if (Object.keys(errors).filter((key) => errors[key]).length > 0) {
			setIsSubmitting(false)
			return
		}

		try {
			const signupResponse = await api.post('/users', signupForm)
			if (signupResponse.data?.success === false) {
				setAuthError(signupResponse.data?.message || '회원가입에 실패했습니다.')
				setIsSubmitting(false)
				return
			}

			await login(signupForm.username, signupForm.password, false)
			navigate(signupForm.role === 'ROLE_TUTOR' ? '/tutor/register' : '/')
		} catch (error) {
			setAuthError(error.response?.data?.message || error.message || '회원가입에 실패했습니다.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const isTutorMode = signupForm.role === 'ROLE_TUTOR'

	return (
		<Layout>
			<section className='bg-[#f8fafc] px-4 py-14'>
				<div className='mx-auto max-w-3xl'>
					<div className='mb-8 text-center'>
						<h2 className='mb-2 text-3xl font-bold text-slate-900'>로그인 / 회원가입</h2>
						<p className='text-slate-500'>튜터링고에서 학습을 시작하세요</p>
					</div>

					<div className='mb-6 flex justify-center gap-2'>
						<button
							type='button'
							onClick={() => setSignupForm((prev) => ({ ...prev, role: 'ROLE_USER' }))}
							className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!isTutorMode ? 'bg-[#4f46e5] text-white' : 'border border-[#4f46e5] text-[#4f46e5] hover:bg-indigo-50'}`}
						>
							학생으로 시작
						</button>
						<button
							type='button'
							onClick={() => setSignupForm((prev) => ({ ...prev, role: 'ROLE_TUTOR' }))}
							className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isTutorMode ? 'bg-[#4f46e5] text-white' : 'border border-[#4f46e5] text-[#4f46e5] hover:bg-indigo-50'}`}
						>
							튜터로 시작
						</button>
					</div>

					<div className='mx-auto max-w-[520px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
						<div className='flex border-b border-slate-200'>
							<button
								type='button'
								onClick={() => setActiveTab('login')}
								className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === 'login' ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-slate-500'}`}
							>
								로그인
							</button>
							<button
								type='button'
								onClick={() => setActiveTab('signup')}
								className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === 'signup' ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-slate-500'}`}
							>
								회원가입
							</button>
						</div>

						{activeTab === 'login' ? (
							<form className='space-y-4 pt-6' onSubmit={handleLogin}>
								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>이메일</label>
									<input name='username' type='email' value={loginForm.username} onChange={updateLoginField} className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' required />
								</div>
								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>비밀번호</label>
									<input name='password' type='password' value={loginForm.password} onChange={updateLoginField} className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' required />
								</div>
								<div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
									<div className='flex flex-wrap gap-4 text-slate-600'>
										<label className='flex items-center gap-2'>
											<input name='rememberMe' type='checkbox' checked={loginForm.rememberMe} onChange={updateLoginField} />자동 로그인
										</label>
										<label className='flex items-center gap-2'>
											<input name='rememberId' type='checkbox' checked={loginForm.rememberId} onChange={updateLoginField} />아이디 저장
										</label>
									</div>
									<button type='button' className='text-slate-500 hover:text-slate-800'>비밀번호 찾기</button>
								</div>
								{authError && <p className='text-sm text-red-500'>{authError}</p>}
								<button type='submit' disabled={isSubmitting || isLoading} className='w-full rounded-xl bg-[#4f46e5] px-4 py-3 font-semibold text-white transition hover:bg-[#4338ca] disabled:opacity-60'>로그인</button>
							</form>
						) : (
							<form className='space-y-4 pt-6' onSubmit={handleSignup}>
								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>아이디(이메일)</label>
									<div className='flex gap-2'>
										<input name='username' type='email' value={signupForm.username} onChange={updateSignupField} className='min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' />
										<button type='button' onClick={() => checkDuplicate('username')} className='rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50'>중복확인</button>
									</div>
									{fieldErrors.username && <p className={`mt-1 text-sm ${checkedState.username ? 'text-emerald-600' : 'text-red-500'}`}>{fieldErrors.username}</p>}
								</div>

								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>닉네임</label>
									<div className='flex gap-2'>
										<input name='nickname' type='text' value={signupForm.nickname} onChange={updateSignupField} className='min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' />
										<button type='button' onClick={() => checkDuplicate('nickname')} className='rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50'>중복확인</button>
									</div>
									{fieldErrors.nickname && <p className={`mt-1 text-sm ${checkedState.nickname ? 'text-emerald-600' : 'text-red-500'}`}>{fieldErrors.nickname}</p>}
								</div>

								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>이름</label>
									<input name='name' type='text' value={signupForm.name} onChange={updateSignupField} className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' />
									{fieldErrors.name && <p className='mt-1 text-sm text-red-500'>{fieldErrors.name}</p>}
								</div>

								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>비밀번호</label>
									<input name='password' type='password' value={signupForm.password} onChange={updateSignupField} className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' />
									{fieldErrors.password && <p className='mt-1 text-sm text-red-500'>{fieldErrors.password}</p>}
								</div>

								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>비밀번호 확인</label>
									<input name='passwordCheck' type='password' value={signupForm.passwordCheck} onChange={updateSignupField} className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4f46e5]' />
									{fieldErrors.passwordCheck && <p className='mt-1 text-sm text-red-500'>{fieldErrors.passwordCheck}</p>}
								</div>

								{authError && <p className='text-sm text-red-500'>{authError}</p>}
								<button type='submit' disabled={isSubmitting || isLoading} className='w-full rounded-xl bg-[#4f46e5] px-4 py-3 font-semibold text-white transition hover:bg-[#4338ca] disabled:opacity-60'>회원가입</button>
							</form>
						)}

						<p className='mt-4 text-sm text-slate-400'>로그인/회원가입은 서버 사용자 정보를 기준으로 처리됩니다.</p>
					</div>
				</div>
			</section>
		</Layout>
	)
}

export default Auth

