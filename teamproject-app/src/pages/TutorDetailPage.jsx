import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import httpClient from '../shared/api/httpClient';

export default function TutorDetailPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTutorDetail();
  }, [id]);

  const fetchTutorDetail = async () => {
    try {
      const response = await httpClient.get(`/tutors/${id}`);
      const d = response.data?.data ?? response.data;
      setTutor(d?.tutor ?? d);
      setReviews(d?.reviews ?? []);
    } catch (err) {
      setError('튜터 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error || '튜터를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start mb-6">
            {tutor.profileImg && (
              <img
                src={tutor.profileImg}
                alt={tutor.name}
                className="w-32 h-32 rounded-full object-cover mr-6"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tutor.name || tutor.nickname}
              </h1>
              {tutor.ratingAvg > 0 && (
                <div className="flex items-center text-lg text-gray-600 mb-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{tutor.ratingAvg}</span>
                  <span className="ml-1">({tutor.reviewCount} 리뷰)</span>
                </div>
              )}
              {tutor.subjects && (
                <p className="text-lg text-gray-700 mb-2">{tutor.subjects}</p>
              )}
              {tutor.price && (
                <p className="text-2xl font-semibold text-blue-600">
                  {tutor.price.toLocaleString()}원/시간
                </p>
              )}
            </div>
          </div>

          {tutor.videoUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">소개 영상</h2>
              <div className="aspect-video">
                <iframe
                  src={tutor.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {tutor.selfIntro && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">자기소개</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{tutor.selfIntro}</p>
            </div>
          )}

          {tutor.experience && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">경력</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{tutor.experience}</p>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">수강 후기</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.reviewId} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">
                      {'★'.repeat(review.rating)}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {review.studentName}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                  {review.createdAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
