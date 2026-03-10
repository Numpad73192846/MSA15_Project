import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function TutorDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchData();
      }
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [meRes, bookingsRes] = await Promise.allSettled([
        httpClient.get('/tutors/me'),
        httpClient.get('/bookings'),
      ]);
      if (meRes.status === 'fulfilled') setData(meRes.value.data.data || meRes.value.data);
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.data || bookingsRes.value.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await httpClient.put(`/bookings/${bookingId}/${action}`);
      fetchData();
    } catch (err) {
      console.error('Booking action failed', err);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  const stats = data?.tutorStats || {};
  const upcomingLessons = data?.upcomingLessons || [];
  const pastLessons = data?.pastLessons || [];
  const displayedBookings = activeTab === 'upcoming' ? upcomingLessons : pastLessons;

  const statusLabel = (s) => ({ CONFIRMED: '확정', PENDING: '대기', CANCELLED: '취소', COMPLETED: '완료' }[s] || s);
  const statusClass = (s) => ({
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }[s] || 'bg-gray-100 text-gray-800');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">튜터 대시보드</h1>
          <div className="flex gap-3">
            <Link
              to="/tutor/mypage"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              마이페이지
            </Link>
            <Link
              to="/tutor/profile-edit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              프로필 편집
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalStudents ?? 0}</div>
            <div className="text-sm text-gray-600 mt-1">총 수강생</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.completedLessons ?? 0}</div>
            <div className="text-sm text-gray-600 mt-1">완료된 수업</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {stats.ratingAvg ? Number(stats.ratingAvg).toFixed(1) : '-'}
            </div>
            <div className="text-sm text-gray-600 mt-1">평균 평점</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.reviewCount ?? 0}</div>
            <div className="text-sm text-gray-600 mt-1">총 리뷰</div>
          </div>
        </div>

        {/* 수업 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">수업 관리</h2>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                예정된 수업 ({upcomingLessons.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                지난 수업 ({pastLessons.length})
              </button>
            </div>
          </div>

          {displayedBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {activeTab === 'upcoming' ? '예정된 수업이 없습니다.' : '지난 수업이 없습니다.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">수강생</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">과목</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">날짜/시간</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">상태</th>
                    {activeTab === 'upcoming' && (
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">액션</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayedBookings.map((l, i) => (
                    <tr key={l.bookingId || i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{l.studentName}</td>
                      <td className="py-3 px-4 text-gray-600">{l.subjectName || l.subject}</td>
                      <td className="py-3 px-4 text-gray-600">{l.lessonDate} {l.startTime}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(l.status)}`}>
                          {statusLabel(l.status)}
                        </span>
                      </td>
                      {activeTab === 'upcoming' && (
                        <td className="py-3 px-4">
                          {l.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBookingAction(l.bookingId, 'confirm')}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                확정
                              </button>
                              <button
                                onClick={() => handleBookingAction(l.bookingId, 'cancel')}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                              >
                                취소
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 빠른 링크 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tutor/profile-edit" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">✏️</div>
            <div className="text-sm font-medium text-gray-700">프로필 편집</div>
          </Link>
          <Link to="/tutor/schedule-edit" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-gray-700">일정 관리</div>
          </Link>
          <Link to="/tutor/mypage" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-gray-700">마이페이지</div>
          </Link>
          <Link to="/tutors" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm font-medium text-gray-700">튜터 목록</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
