import { Link } from 'react-router-dom';

const languages = [
  { rank: 1, name: '영어', flag: '🇺🇸', learners: '1.5B+', desc: '세계 공용어로 비즈니스, 학문 등 모든 분야에서 필수입니다.' },
  { rank: 2, name: '중국어', flag: '🇨🇳', learners: '1.1B+', desc: '14억 인구가 사용하는 세계 최다 사용 언어입니다.' },
  { rank: 3, name: '스페인어', flag: '🇪🇸', learners: '560M+', desc: '20개국 이상에서 사용되는 라틴아메리카의 핵심 언어입니다.' },
  { rank: 4, name: '일본어', flag: '🇯🇵', learners: '128M+', desc: '일본 문화, 비즈니스, 관광에 필수적인 언어입니다.' },
  { rank: 5, name: '프랑스어', flag: '🇫🇷', learners: '280M+', desc: '국제기구의 공식 언어로 외교와 문화의 언어입니다.' },
  { rank: 6, name: '독일어', flag: '🇩🇪', learners: '132M+', desc: '유럽 최대 경제국의 언어로 취업 경쟁력이 높습니다.' },
  { rank: 7, name: '포르투갈어', flag: '🇧🇷', learners: '258M+', desc: '브라질 등 신흥 시장 진출을 위한 전략 언어입니다.' },
  { rank: 8, name: '아랍어', flag: '🇸🇦', learners: '422M+', desc: '중동 시장 및 이슬람 문화권 진출의 핵심 언어입니다.' },
  { rank: 9, name: '한국어', flag: '🇰🇷', learners: '77M+', desc: 'K-POP, K-드라마로 세계적 인기를 얻고 있는 언어입니다.' },
  { rank: 10, name: '이탈리아어', flag: '🇮🇹', learners: '85M+', desc: '예술, 패션, 요리 분야에서 최고의 위상을 가진 언어입니다.' },
];

export default function LanguagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">인기 언어 TOP 10</h1>
          <p className="text-xl text-blue-100">지금 가장 많이 배우는 언어를 확인하세요</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.rank} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                {lang.rank}
              </div>
              <div className="text-4xl flex-shrink-0">{lang.flag}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{lang.name}</h3>
                  <span className="text-sm text-gray-500">학습자 {lang.learners}</span>
                </div>
                <p className="text-gray-600 text-sm">{lang.desc}</p>
              </div>
              <Link
                to="/tutors"
                className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                튜터 찾기
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
