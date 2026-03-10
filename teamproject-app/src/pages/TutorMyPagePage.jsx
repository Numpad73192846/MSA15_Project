import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function TutorMyPagePage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const response = await httpClient.get('/tutors/me');
      setData(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch tutor mypage', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  const profile = data?.tutorProfile || {};
  const stats = data?.tutorStats || {};
  const upcomingLessons = data?.upcomingLessons || [];
  const pastLessons = data?.pastLessons || [];
  const reviews = data?.tutorReviews || [];
  const earnings = data?.monthlyEarnings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">튜터 마이페이지</h1>
          <Link
            to="/tutor/profile-edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            프로필 편집
          </Link>
        </div>

        {/* 프로필 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {profile.profileImg && (
              <img src={profile.profileImg} alt="프로필" className="w-24 h-24 rounded-full object-cover" />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name || profile.nickname || user?.name}
              </h2>
              {profile.subjects && (
                <p className="text-gray-600 mb-2">{profile.subjects}</p>
              )}
              {profile.price && (
                <p className="text-blue-600 font-semibold">{Number(profile.price).toLocaleString()}원/시간</p>
              )}
              {profile.selfIntro && (
                <p className="text-gray-700 mt-3 text-sm line-clamp-3">{profile.selfIntro}</p>
              )}
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudents ?? 0}</div>
            <div className="text-sm text-gray-600">총 수강생</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedLessons ?? 0}</div>
            <div className="text-sm text-gray-600">완료된 수업</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.ratingAvg ? Number(stats.ratingAvg).toFixed(1) : '-'}
            </div>
            <div className="text-sm text-gray-600">평균 평점</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.reviewCount ?? 0}</div>
            <div className="text-sm text-gray-600">리뷰 수</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 예정된 수업 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">예정된 수업</h2>
            {upcomingLessons.length === 0 ? (
              <p className="text-gray-500">예정된 수업이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {upcomingLessons.slice(0, 5).map((l, i) => (
                  <div key={l.bookingId || i} className="border-b pb-3">
                    <p className="font-medium">{l.studentName}</p>
                    <p className="text-sm text-gray-600">{l.subjectName || l.subject}</p>
                    <p className="text-sm text-gray-500">{l.lessonDate} {l.startTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 최근 리뷰 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">최근 리뷰</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">아직 리뷰가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((r, i) => (
                  <div key={r.reviewId || i} className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                      <span className="text-sm text-gray-600">{r.studentName}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 월별 수익 */}
        {earnings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">월별 수익</h2>
            <div className="space-y-2">
              {earnings.slice(0, 6).map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-600">{e.month}</span>
                  <span className="font-semibold">{Number(e.amount || 0).toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
