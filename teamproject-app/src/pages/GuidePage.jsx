import { Link } from 'react-router-dom';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">튜터 이용 가이드</h1>
          <p className="text-xl text-blue-100">세계인들의 언어에서 최고의 튜터를 만나보세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { step: '1', title: '튜터 탐색', icon: '🔍', desc: '언어, 가격, 평점으로 원하는 튜터를 검색하고 프로필을 확인하세요.' },
            { step: '2', title: '수업 예약', icon: '📅', desc: '튜터의 스케줄을 확인하고 원하는 시간에 수업을 예약하세요.' },
            { step: '3', title: '수업 시작', icon: '🎓', desc: '온라인 또는 오프라인으로 튜터와 함께 언어를 배우세요.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">튜터 등록 방법</h2>
          <div className="space-y-4">
            {[
              { title: '계정 생성', desc: '튜터로 회원가입하여 계정을 만드세요.' },
              { title: '프로필 작성', desc: '전문 분야, 경력, 자격증, 가격 등을 입력하세요.' },
              { title: '서류 제출', desc: '학력 증명서, 자격증 등 관련 서류를 제출하세요.' },
              { title: '승인 후 활동', desc: '관리자 심사 후 튜터로 활동을 시작하세요.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              to="/tutor/register"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              튜터 등록 시작하기
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/faq" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">자주 묻는 질문</h3>
            <p className="text-gray-600 text-sm">궁금한 점을 FAQ에서 확인하세요.</p>
          </Link>
          <Link to="/contact" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">문의하기</h3>
            <p className="text-gray-600 text-sm">추가 도움이 필요하시면 연락주세요.</p>
          </Link>
          <Link to="/guide/policies" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">이용약관</h3>
            <p className="text-gray-600 text-sm">서비스 이용 약관을 확인하세요.</p>
          </Link>
          <Link to="/guide/language" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">인기 언어 TOP 10</h3>
            <p className="text-gray-600 text-sm">가장 인기 있는 학습 언어를 확인하세요.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
