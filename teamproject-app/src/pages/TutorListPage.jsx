import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../shared/api/httpClient';

export default function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await httpClient.get('/tutors');
      const list = response.data?.data ?? response.data;
      setTutors(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('튜터 목록을 불러오는데 실패했습니다.');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">튜터 목록</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <Link
              key={tutor.userId}
              to={`/tutors/${tutor.userId}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {tutor.profileImg && (
                    <img
                      src={tutor.profileImg}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tutor.name || tutor.nickname}
                    </h3>
                    {tutor.ratingAvg > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{tutor.ratingAvg}</span>
                        <span className="ml-1">({tutor.reviewCount})</span>
                      </div>
                    )}
                  </div>
                </div>
                {tutor.subjects && (
                  <p className="text-sm text-gray-600 mb-2">
                    {tutor.subjects}
                  </p>
                )}
                {tutor.bio && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {tutor.bio}
                  </p>
                )}
                {tutor.price && (
                  <p className="mt-4 text-lg font-semibold text-blue-600">
                    {tutor.price.toLocaleString()}원/시간
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

