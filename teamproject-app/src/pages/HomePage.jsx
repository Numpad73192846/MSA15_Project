import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            세계인들의 언어 학습 플랫폼
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            전문 튜터와 함께 원하는 언어를 배우고, 글로벌 커뮤니케이션 능력을 키워보세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/tutors"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              튜터 둘러보기
            </Link>
            <Link
              to="/tutor/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              튜터 등록하기
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">인기 언어</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {['영어', '중국어', '일본어', '스페인어', '프랑스어', '한국어'].map((lang) => (
            <Link
              key={lang}
              to="/tutors"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-semibold text-gray-900">{lang}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <p className="text-blue-100">전문 튜터</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-blue-100">지원 언어</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-blue-100">수강생</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
