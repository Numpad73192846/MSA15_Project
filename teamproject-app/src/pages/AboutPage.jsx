export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">회사 소개</h1>
          <p className="text-xl text-blue-100">세계인들의 언어를 연결하는 플랫폼</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">우리의 미션</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              세계인들의 언어는 언어의 장벽을 허물고 전 세계 사람들이 서로 소통할 수 있도록 돕는 플랫폼입니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              우리는 최고 수준의 튜터와 학생을 연결하여 언어 학습의 새로운 경험을 제공합니다.
              개인화된 학습 방식으로 누구나 원하는 언어를 효과적으로 배울 수 있습니다.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                { num: '1,000+', label: '전문 튜터' },
                { num: '50+', label: '지원 언어' },
                { num: '10,000+', label: '수강생' },
                { num: '98%', label: '만족도' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{s.num}</div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">우리의 가치</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌍', title: '글로벌 연결', desc: '전 세계 튜터와 학생을 연결하는 글로벌 플랫폼을 운영합니다.' },
              { icon: '✅', title: '검증된 튜터', desc: '엄격한 심사를 통해 검증된 전문 튜터만 활동합니다.' },
              { icon: '📱', title: '편리한 접근', desc: '언제 어디서나 쉽게 수업을 예약하고 진행할 수 있습니다.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
