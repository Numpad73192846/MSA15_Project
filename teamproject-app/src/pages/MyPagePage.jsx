import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function MyPagePage() {
  const { user, loading: authLoading } = useAuth();
  const [mypage, setMypage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchMyPage();
      }
    }
  }, [user, authLoading]);

  const fetchMyPage = async () => {
    try {
      const response = await httpClient.get('/users/me/mypage');
      setMypage(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch mypage', err);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) => {
    const map = { CONFIRMED: '확정', PENDING: '대기', CANCELLED: '취소', COMPLETED: '완료' };
    return map[status] || status;
  };

  const statusClass = (status) => {
    const map = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  const upcomingBookings = mypage?.upcomingBookings || [];
  const pastBookings = mypage?.pastBookings || [];
  const stats = mypage?.memberStats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

        {/* 내 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">내 정보</h2>
            <Link to="/member/profile-edit" className="text-sm text-blue-600 hover:underline">
              프로필 편집
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {(mypage?.profileImg || user?.profileImg) && (
              <img
                src={mypage?.profileImg || user?.profileImg}
                alt="프로필"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="space-y-1">
              <p><span className="font-medium">이름:</span> {mypage?.name || user?.name}</p>
              <p><span className="font-medium">아이디:</span> {mypage?.username || user?.username}</p>
              <p><span className="font-medium">이메일:</span> {mypage?.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* 통계 */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBookings ?? 0}</div>
              <div className="text-sm text-gray-600">총 예약</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedLessons ?? 0}</div>
              <div className="text-sm text-gray-600">완료된 수업</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.reviewCount ?? 0}</div>
              <div className="text-sm text-gray-600">작성한 리뷰</div>
            </div>
          </div>
        )}

        {/* 예정 수업 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">예정된 수업</h2>
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-500">예정된 수업이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div key={b.bookingId || b.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{b.tutorName}</p>
                    <p className="text-sm text-gray-600">{b.subjectName || b.subject}</p>
                    <p className="text-sm text-gray-500">{b.lessonDate} {b.startTime}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusClass(b.status)}`}>
                    {statusLabel(b.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 지난 수업 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">지난 수업</h2>
          {pastBookings.length === 0 ? (
            <p className="text-gray-500">지난 수업이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {pastBookings.map((b) => (
                <div key={b.bookingId || b.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{b.tutorName}</p>
                    <p className="text-sm text-gray-600">{b.subjectName || b.subject}</p>
                    <p className="text-sm text-gray-500">{b.lessonDate} {b.startTime}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusClass(b.status)}`}>
                    {statusLabel(b.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
