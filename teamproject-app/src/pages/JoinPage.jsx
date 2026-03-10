import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import httpClient from '../shared/api/httpClient';

export default function JoinPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', passwordConfirm: '',
    name: '', nickname: '', role: 'ROLE_USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateField = async (field) => {
    if (!field) return;
    try {
      const res = await httpClient.post(`/users/validate?fields=${field}`, form);
      const errs = res.data.data || res.data;
      if (errs && typeof errs === 'object') {
        setErrors((prev) => ({ ...prev, ...errs }));
      }
    } catch (err) {
      console.error('Validation error', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setLoading(true);
    try {
      await httpClient.post('/users', form);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || '회원가입에 실패했습니다.';
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">회원가입</h2>
          <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              로그인
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-5">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {globalError}
            </div>
          )}

          {/* 역할 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">가입 유형</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'ROLE_USER', label: '수강생', desc: '튜터를 찾고 수업을 받고 싶어요' },
                { value: 'ROLE_TUTOR_PENDING', label: '튜터', desc: '학생들에게 수업을 제공하고 싶어요' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    form.role === opt.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={form.role === opt.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-900 mb-1">{opt.label}</span>
                  <span className="text-xs text-gray-500">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 아이디 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={() => validateField('username')}
              className={inputClass('username')}
              placeholder="아이디를 입력하세요"
              required
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={inputClass('password')}
              placeholder="비밀번호를 입력하세요"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={inputClass('passwordConfirm')}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass('name')}
              placeholder="이름을 입력하세요"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              onBlur={() => validateField('nickname')}
              className={inputClass('nickname')}
              placeholder="닉네임을 입력하세요"
              required
            />
            {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}
