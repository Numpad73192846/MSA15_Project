import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function TutorProfileEditPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', selfIntro: '', experience: '', price: '', subjects: '', bio: '' });
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (user) { fetchProfile(); }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await httpClient.get('/tutors/me');
      const profile = (res.data.data || res.data)?.tutorProfile || {};
      setForm({
        name: profile.name || user?.name || '',
        selfIntro: profile.selfIntro || '',
        experience: profile.experience || '',
        price: profile.price || '',
        subjects: profile.subjects || '',
        bio: profile.bio || '',
      });
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (profileImg) fd.append('profileImg', profileImg);
      await httpClient.post('/tutors/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('프로필이 업데이트되었습니다.');
    } catch (err) {
      setError(err.response?.data?.message || '업데이트에 실패했습니다.');
    } finally { setLoading(false); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">튜터 프로필 편집</h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지</label>
              <input type="file" accept="image/*" onChange={(e) => setProfileImg(e.target.files[0])}
                className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" value={form.name} onChange={(e) => setForm(p => ({...p, name: e.target.value}))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시간당 수업료 (원)</label>
              <input type="number" value={form.price} onChange={(e) => setForm(p => ({...p, price: e.target.value}))} className={inputClass} placeholder="예: 30000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가르치는 과목</label>
              <input type="text" value={form.subjects} onChange={(e) => setForm(p => ({...p, subjects: e.target.value}))} className={inputClass} placeholder="예: 영어 회화, IELTS" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
              <textarea rows={4} value={form.selfIntro} onChange={(e) => setForm(p => ({...p, selfIntro: e.target.value}))} className={inputClass} placeholder="자기소개를 작성하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">경력 사항</label>
              <textarea rows={4} value={form.experience} onChange={(e) => setForm(p => ({...p, experience: e.target.value}))} className={inputClass} placeholder="경력 사항을 작성하세요" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">간단한 소개</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm(p => ({...p, bio: e.target.value}))} className={inputClass} placeholder="수업 스타일을 간단히 소개해 주세요" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/tutor/mypage')}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
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
