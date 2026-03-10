import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function MemberProfileEditPage() {
  const { user, loading: authLoading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', password: '', passwordConfirm: '' });
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (user) setForm((p) => ({ ...p, name: user.name || '' }));
  }, [user, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      if (form.name) fd.append('name', form.name);
      if (form.password) {
        fd.append('password', form.password);
        fd.append('passwordConfirm', form.passwordConfirm);
      }
      if (profileImg) fd.append('profileImg', profileImg);
      await httpClient.put('/users', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await checkAuth();
      setSuccess('프로필이 업데이트되었습니다.');
      setForm((p) => ({ ...p, password: '', passwordConfirm: '' }));
    } catch (err) {
      setError(err.response?.data?.message || '업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">프로필 편집</h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지</label>
              <div className="flex items-center gap-4">
                {(user?.profileImg || profileImg) && (
                  <img
                    src={profileImg ? URL.createObjectURL(profileImg) : user.profileImg}
                    alt="프로필"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setProfileImg(e.target.files[0])}
                  className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 (선택)</label>
              <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="변경할 비밀번호 입력" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input type="password" value={form.passwordConfirm} onChange={(e) => setForm((p) => ({ ...p, passwordConfirm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호 재입력" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/mypage')}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                취소
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
                {loading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
