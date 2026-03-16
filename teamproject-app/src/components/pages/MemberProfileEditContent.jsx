import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../common/Layout'
import api from '../../services/api'
import useAuth from '../../utils/hooks/useAuth'

const MemberProfileEdit = () => {
	const { isLoading: authLoading, isLogin, hasRole, refreshUser } = useAuth()
	const [name, setName] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [previewImg, setPreviewImg] = useState('')
	const [selectedFile, setSelectedFile] = useState(null)
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
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

		const fetchMe = async () => {
			setLoading(true)
			setError('')
			try {
				const response = await api.get('/users/me')
				const user = response.data?.data || {}
				setName(user.name || '')
				setUsername(user.username || '')
				setEmail(user.email || '')
				setPreviewImg(user.profileImg || '')
			} catch {
				setError('회원 정보를 불러오지 못했습니다.')
			} finally {
				setLoading(false)
			}
		}

		fetchMe()
	}, [authLoading, isLogin])

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

		if (password && password !== passwordConfirm) {
			setError('비밀번호 확인이 일치하지 않습니다.')
			return
		}

		setSaving(true)
		try {
			const body = new FormData()
			body.append('name', name)
			if (password) {
				body.append('password', password)
				body.append('passwordConfirm', passwordConfirm)
			}
			if (selectedFile) {
				body.append('profileImg', selectedFile)
			}

			await api.put('/users', body, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			await refreshUser()

			setSuccess('회원 정보가 저장되었습니다.')
			setPassword('')
			setPasswordConfirm('')
			setSelectedFile(null)
		} catch (err) {
			setError(err?.response?.data?.message || '회원 정보 저장에 실패했습니다.')
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

	if (!hasRole('ROLE_USER') && !hasRole('ROLE_ADMIN')) {
		return (
			<Layout>
				<div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
					<h2 className='text-2xl font-bold text-slate-900'>접근 권한이 없습니다</h2>
					<Link to='/tutor/mypage' className='rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'>튜터 마이페이지</Link>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<section className='bg-[#f8fafc] px-4 py-10'>
				<div className='mx-auto max-w-3xl'>
					<div className='mb-6 flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-extrabold text-slate-900'>회원정보 수정</h1>
							<p className='mt-1 text-sm text-slate-500'>프로필 이미지, 이름, 비밀번호를 변경할 수 있습니다.</p>
						</div>
						<Link to='/member/mypage' className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>마이페이지</Link>
					</div>

					<form onSubmit={handleSubmit} className='space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<div className='flex flex-col items-center gap-3'>
							<div className='h-24 w-24 overflow-hidden rounded-full bg-slate-100'>
								{previewImg ? (
									<img src={previewImg} alt='프로필 미리보기' className='h-full w-full object-cover' />
								) : (
									<div className='flex h-full w-full items-center justify-center text-3xl'>??</div>
								)}
							</div>
							<input type='file' accept='image/*' onChange={handleImageChange} className='block text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-slate-700' />
						</div>

						<div className='grid gap-4 md:grid-cols-2'>
							<label className='block'>
								<span className='mb-1 block text-sm font-semibold text-slate-700'>아이디</span>
								<input value={username} disabled className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500' />
							</label>
							<label className='block'>
								<span className='mb-1 block text-sm font-semibold text-slate-700'>이메일</span>
								<input value={email} disabled className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500' />
							</label>
						</div>

						<label className='block'>
							<span className='mb-1 block text-sm font-semibold text-slate-700'>이름</span>
							<input value={name} onChange={(e) => setName(e.target.value)} required className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none' />
						</label>

						<div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
							<p className='mb-3 text-sm font-semibold text-slate-700'>비밀번호 변경 (선택)</p>
							<div className='grid gap-4 md:grid-cols-2'>
								<label className='block'>
									<span className='mb-1 block text-sm font-semibold text-slate-700'>새 비밀번호</span>
									<input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none' />
								</label>
								<label className='block'>
									<span className='mb-1 block text-sm font-semibold text-slate-700'>비밀번호 확인</span>
									<input type='password' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4f46e5] focus:outline-none' />
								</label>
							</div>
						</div>

						{error && <p className='text-sm font-semibold text-red-500'>{error}</p>}
						{success && <p className='text-sm font-semibold text-emerald-600'>{success}</p>}

						<div className='flex justify-end gap-2'>
							<Link to='/member/mypage' className='rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>취소</Link>
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

export default MemberProfileEdit


