import { Link } from 'react-router-dom';

const LANGUAGES = [
  { name: '영어', emoji: '🇺🇸' },
  { name: '중국어', emoji: '🇨🇳' },
  { name: '일본어', emoji: '🇯🇵' },
  { name: '스페인어', emoji: '🇪🇸' },
  { name: '프랑스어', emoji: '🇫🇷' },
  { name: '한국어', emoji: '🇰🇷' },
];

const STATS = [
  { icon: '👨‍🏫', number: '1,000+', label: '전문 튜터' },
  { icon: '🌍', number: '50+', label: '지원 언어' },
  { icon: '🎓', number: '10,000+', label: '수강생' },
];

export default function HomePage() {
  return (
    <div style={{backgroundColor:'var(--background-color)'}}>
      {/* Hero Section */}
      <section className="px-5 py-16" style={{backgroundColor:'#f8f9fa'}}>
        <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{color:'var(--text-primary)'}}>
            세계인들의 언어 학습 플랫폼
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{color:'#666'}}>
            전문 튜터와 함께 원하는 언어를 배우고, 글로벌 커뮤니케이션 능력을 키워보세요
          </p>
          <div className="flex flex-wrap gap-5 justify-center mt-2">
            <Link
              to="/tutors"
              className="px-8 py-4 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{backgroundColor:'var(--primary-color)'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='var(--primary-color)'}
            >
              튜터 둘러보기
            </Link>
            <Link
              to="/tutor/register"
              className="px-8 py-4 font-semibold rounded-lg border-2 transition-all hover:bg-indigo-50"
              style={{color:'var(--primary-color)', borderColor:'var(--primary-color)', backgroundColor:'var(--surface-color)'}}
            >
              튜터 등록하기
            </Link>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="px-5 py-16" style={{backgroundColor:'#f8f9fa'}}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{color:'var(--text-primary)'}}>인기 언어</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {LANGUAGES.map(({ name, emoji }) => (
              <Link
                key={name}
                to={`/tutors?language=${encodeURIComponent(name)}`}
                className="flex flex-col items-center justify-center p-5 rounded-lg border-2 font-semibold text-base transition-all hover:-translate-y-1 hover:shadow-md"
                style={{backgroundColor:'var(--surface-color)', borderColor:'var(--border-color)', color:'#4a5568'}}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor='var(--primary-color)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='var(--primary-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor='var(--surface-color)'; e.currentTarget.style.color='#4a5568'; e.currentTarget.style.borderColor='var(--border-color)'; }}
              >
                <span className="text-3xl mb-2">{emoji}</span>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-5 py-20" style={{backgroundColor:'var(--surface-color)'}}>
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center gap-8">
          {STATS.map(({ icon, number, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md min-w-[200px]"
              style={{borderColor:'var(--border-color)', backgroundColor:'var(--surface-color)'}}
            >
              <span className="text-3xl p-3 rounded-xl mb-3" style={{backgroundColor:'#eff6ff', color:'var(--primary-color)'}}>
                {icon}
              </span>
              <div className="text-4xl font-extrabold mb-2 tracking-tight" style={{color:'var(--text-primary)'}}>{number}</div>
              <div className="text-[15px] font-medium" style={{color:'var(--text-secondary)'}}>{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
