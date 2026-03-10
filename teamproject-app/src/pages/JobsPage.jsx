export default function JobsPage() {
  const jobs = [
    { title: '프론트엔드 개발자', type: '정규직', location: '서울', dept: '개발팀', desc: 'React, TypeScript를 활용한 서비스 개발' },
    { title: '백엔드 개발자', type: '정규직', location: '서울', dept: '개발팀', desc: 'Spring Boot 기반 API 서버 개발' },
    { title: '언어 교육 콘텐츠 기획자', type: '정규직', location: '서울', dept: '콘텐츠팀', desc: '언어 학습 콘텐츠 기획 및 튜터 커뮤니케이션' },
    { title: '고객 서비스 담당자', type: '계약직', location: '서울/재택', dept: '운영팀', desc: '회원 및 튜터 지원 업무' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">채용 공고</h1>
          <p className="text-xl text-blue-100">세계인들의 언어와 함께 성장할 인재를 모집합니다</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">우리와 함께 일하는 이유</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {['유연한 근무', '성장 지원', '경쟁력 있는 연봉', '수평적 문화'].map((b) => (
              <div key={b} className="bg-white rounded-lg p-3 text-center text-sm font-medium text-blue-700">
                {b}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{job.dept}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{job.type}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">📍 {job.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{job.desc}</p>
                </div>
                <button
                  onClick={() => alert('지원 기능은 준비 중입니다. careers@languages.kr 로 이메일 지원해주세요.')}
                  className="flex-shrink-0 ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  지원하기
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-600 mb-2">원하는 포지션이 없으신가요?</p>
          <p className="text-sm text-gray-500">
            <strong>careers@languages.kr</strong>로 자유롭게 지원해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
