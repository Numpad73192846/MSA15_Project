import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

const STEPS = ['기본 정보', '언어/과목', '경력/학력', '서류 제출'];

export default function TutorRegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    nickname: user?.nickname || '',
    selfIntro: '',
    experience: '',
    price: '',
    subjects: '',
    languages: '',
    bio: '',
  });
  const [files, setFiles] = useState({ education: null, degree: null, certificate: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (type, file) => {
    setFiles((p) => ({ ...p, [type]: file }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await httpClient.post('/tutors/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      for (const [type, file] of Object.entries(files)) {
        if (file) {
          const docFd = new FormData();
          docFd.append('docType', type.toUpperCase());
          docFd.append('file', file);
          await httpClient.post('/tutors/documents', docFd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      navigate('/tutor/mypage');
    } catch (err) {
      setError(err.response?.data?.message || '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">튜터 등록</h1>
          <p className="text-gray-600">전문 튜터로 활동을 시작하세요</p>
        </div>

        {/* 진행 단계 */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-500'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-1 mx-2 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
          )}

          {/* Step 0: 기본 정보 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
              <div>
                <label className={labelClass}>이름</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="실명을 입력하세요" />
              </div>
              <div>
                <label className={labelClass}>닉네임</label>
                <input type="text" name="nickname" value={form.nickname} onChange={handleChange} className={inputClass} placeholder="닉네임을 입력하세요" />
              </div>
              <div>
                <label className={labelClass}>시간당 수업료 (원)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="예: 30000" />
              </div>
              <div>
                <label className={labelClass}>자기소개</label>
                <textarea name="selfIntro" value={form.selfIntro} onChange={handleChange} rows={4} className={inputClass} placeholder="자기소개를 작성하세요" />
              </div>
            </div>
          )}

          {/* Step 1: 언어/과목 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-900">언어 및 과목</h2>
              <div>
                <label className={labelClass}>가르칠 언어</label>
                <input type="text" name="languages" value={form.languages} onChange={handleChange} className={inputClass} placeholder="예: 영어, 일본어" />
              </div>
              <div>
                <label className={labelClass}>과목/분야</label>
                <input type="text" name="subjects" value={form.subjects} onChange={handleChange} className={inputClass} placeholder="예: 회화, 비즈니스 영어, IELTS" />
              </div>
              <div>
                <label className={labelClass}>간단한 소개</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className={inputClass} placeholder="수업 스타일과 특징을 소개하세요" />
              </div>
            </div>
          )}

          {/* Step 2: 경력/학력 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-900">경력 및 학력</h2>
              <div>
                <label className={labelClass}>교육 경력</label>
                <textarea name="experience" value={form.experience} onChange={handleChange} rows={5} className={inputClass}
                  placeholder="예:&#10;- 2020-현재: ABC 영어 학원 강사&#10;- 2018-2020: 개인 과외 (TOEIC, 회화)" />
              </div>
            </div>
          )}

          {/* Step 3: 서류 제출 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-900">서류 제출</h2>
              <p className="text-sm text-gray-500">관련 서류를 제출하면 검증 배지를 받을 수 있습니다. (선택 사항)</p>
              {[
                { key: 'education', label: '재학증명서/졸업증명서', desc: '최종 학력 증명 서류' },
                { key: 'degree', label: '학위증', desc: '대학교 이상 학위 증명서' },
                { key: 'certificate', label: '자격증', desc: '관련 자격증 또는 수료증' },
              ].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 text-sm">{doc.label}</div>
                    <div className="text-xs text-gray-500">{doc.desc}</div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                    className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 file:text-xs hover:file:bg-blue-200"
                  />
                  {files[doc.key] && (
                    <div className="text-xs text-green-600 mt-1">✓ {files[doc.key].name}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 네비게이션 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              이전
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? '제출 중...' : '등록 완료'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
