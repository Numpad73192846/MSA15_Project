import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function ScheduleEditPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading]);

  const toggleSlot = (day, hour) => {
    const key = `${day}-${hour}`;
    setSchedule((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const timeRanges = Object.entries(schedule)
        .filter(([, v]) => v)
        .map(([k]) => {
          const [day, hour] = k.split('-');
          return { day, startTime: hour, endTime: `${String(Number(hour.split(':')[0]) + 1).padStart(2, '0')}:00` };
        });
      await httpClient.post('/tutors/me/time-ranges', { timeRanges });
      setSuccess('일정이 저장되었습니다.');
    } catch (err) {
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally { setLoading(false); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">수업 가능 시간 설정</h1>
        <p className="text-gray-600 mb-8">수업을 진행할 수 있는 시간대를 선택하세요</p>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <div className="min-w-max">
            <div className="flex gap-1 mb-2">
              <div className="w-16" />
              {DAYS.map((d) => (
                <div key={d} className="w-16 text-center text-sm font-medium text-gray-700">{d}</div>
              ))}
            </div>
            {HOURS.map((hour) => (
              <div key={hour} className="flex gap-1 mb-1">
                <div className="w-16 text-right pr-2 text-xs text-gray-500 py-1">{hour}</div>
                {DAYS.map((day) => {
                  const key = `${day}-${hour}`;
                  return (
                    <button
                      key={day}
                      onClick={() => toggleSlot(day, hour)}
                      className={`w-16 h-7 rounded text-xs transition-colors ${
                        schedule[key]
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 hover:bg-blue-100'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-blue-500 rounded" /> 선택됨
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded" /> 선택 안됨
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => navigate('/tutor/dashboard')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            취소
          </button>
          <button onClick={handleSave} disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
            {loading ? '저장 중...' : '일정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
