import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const initialForm = {
	name: '',
	phone: '',
	headline: '',
	bio: '',
	selfIntro: '',
	videoUrl: '',
	defaultZoomUrl: '',
	bankName: '',
	accountNumber: '',
	accountHolder: '',
	password: '',
	passwordConfirm: '',
}

const TutorProfileEdit = () => {
	const { isLoading: authLoading, isLogin, hasRole, refreshUser } = useAuth()
	const [form, setForm] = useState(initialForm)
	const [previewImg, setPreviewImg] = useState('')
	const [selectedFile, setSelectedFile] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		if (authLoading) return
		if (!isLogin) {
			setLoading(false)
			return
		}

		const fetchProfile = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await api.get('/tutors/me')
				const data = response.data?.data
				const profile = data?.tutorProfile || {}
				setForm({
					name: profile.name || '',
					phone: profile.phone || '',
					headline: profile.headline || '',
					bio: profile.bio || '',
					selfIntro: profile.selfIntro || '',
					videoUrl: profile.videoUrl || '',
					defaultZoomUrl: profile.defaultZoomUrl || '',
					bankName: profile.bankName || '',
					accountNumber: profile.accountNumber || '',
					accountHolder: profile.accountHolder || '',
					password: '',
					passwordConfirm: '',
				})
				setPreviewImg(profile.profileImg || '')
			} catch {
				setError('프로필 정보를 불러오지 못했습니다.')
			} finally {
				setLoading(false)
			}
		}

		fetchProfile()
	}, [authLoading, isLogin])

	const handleChange = (event) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleImageChange = (event) => {
		const file = event.target.files?.[0]
		if (!file) return
		setSelectedFile(file)
		setPreviewImg(URL.createObjectURL(file))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (form.password && form.password !== form.passwordConfirm) {
			setError('비밀번호 확인이 일치하지 않습니다.')
			return
		}

		setSaving(true)
		try {
			const body = new FormData()
			Object.entries(form).forEach(([key, value]) => {
				if (key === 'password' || key === 'passwordConfirm') {
					if (value) body.append(key, value)
					return
				}
				body.append(key, value ?? '')
			})
			if (selectedFile) {
				body.append('profileImg', selectedFile)
			}

			await api.put('/tutors', body, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			await refreshUser()

			setSuccess('프로필이 저장되었습니다.')
			setForm((prev) => ({ ...prev, password: '', passwordConfirm: '' }))
			setSelectedFile(null)
		} catch (err) {
			setError(err?.response?.data?.message || '프로필 저장에 실패했습니다.')
		} finally {
			setSaving(false)
		}
	}

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
					<Link to='/member/mypage' className='rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'>회원 마이페이지</Link>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<section className='bg-[#f8fafc] px-4 py-10'>
				<div className='mx-auto max-w-4xl'>
					<div className='mb-6 flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-extrabold text-slate-900'>튜터 프로필 수정</h1>
							<p className='mt-1 text-sm text-slate-500'>공개 프로필과 계정 정보를 수정합니다.</p>
						</div>
						<Link to='/tutor/mypage' className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>마이페이지</Link>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<div className='grid gap-6 md:grid-cols-[140px_1fr]'>
							<div>
								<div className='h-28 w-28 overflow-hidden rounded-full bg-slate-100'>
									{previewImg ? (
										<img src={previewImg} alt='프로필 미리보기' className='h-full w-full object-cover' />
									) : (
										<div className='flex h-full w-full items-center justify-center text-3xl'>?????</div>
									)}
								</div>
								<input type='file' accept='image/*' onChange={handleImageChange} className='mt-3 block w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-slate-700' />
							</div>

							<div className='grid gap-4 md:grid-cols-2'>
								<Input label='이름' name='name' value={form.name} onChange={handleChange} required />
								<Input label='연락처' name='phone' value={form.phone} onChange={handleChange} />
								<div className='md:col-span-2'>
									<Input label='한 줄 소개' name='headline' value={form.headline} onChange={handleChange} />
								</div>
							</div>
						</div>

						<div className='grid gap-4 md:grid-cols-2'>
							<TextArea label='소개' name='bio' value={form.bio} onChange={handleChange} rows={3} />
							<TextArea label='자기소개' name='selfIntro' value={form.selfIntro} onChange={handleChange} rows={3} />
						</div>

						<div className='grid gap-4 md:grid-cols-2'>
							<Input label='소개 영상 URL' name='videoUrl' value={form.videoUrl} onChange={handleChange} />
							<Input label='기본 Zoom URL' name='defaultZoomUrl' value={form.defaultZoomUrl} onChange={handleChange} />
							<Input label='은행명' name='bankName' value={form.bankName} onChange={handleChange} />
							<Input label='계좌번호' name='accountNumber' value={form.accountNumber} onChange={handleChange} />
							<Input label='예금주' name='accountHolder' value={form.accountHolder} onChange={handleChange} />
						</div>

						<div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
							<p className='mb-3 text-sm font-semibold text-slate-700'>비밀번호 변경 (선택)</p>
							<div className='grid gap-4 md:grid-cols-2'>
								<Input label='새 비밀번호' name='password' type='password' value={form.password} onChange={handleChange} />
								<Input label='비밀번호 확인' name='passwordConfirm' type='password' value={form.passwordConfirm} onChange={handleChange} />
							</div>
						</div>

						{error && <p className='text-sm font-semibold text-red-500'>{error}</p>}
						{success && <p className='text-sm font-semibold text-emerald-600'>{success}</p>}

						<div className='flex justify-end gap-2'>
							<Link to='/tutor/mypage' className='rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>취소</Link>
							<button type='submit' disabled={saving} className='rounded-xl bg-[#4f46e5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60'>
								{saving ? '저장 중...' : '저장하기'}
							</button>
						</div>
					</form>
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

const TextArea = ({ label, name, value, onChange, rows = 3 }) => (
	<label className='block'>
		<span className='mb-1 block text-sm font-semibold text-slate-700'>{label}</span>
		<textarea
			name={name}
			value={value}
			onChange={onChange}
			rows={rows}
			className='w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none'
		/>
	</label>
)

export default TutorProfileEdit


