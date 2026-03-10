import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{backgroundColor:'#1a2332', color:'#b0b8c1'}} className="mt-auto w-full">
      <div className="max-w-[1200px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-white font-semibold text-base mb-4">세계인들의 언어</h3>
            <p className="text-sm leading-relaxed" style={{color:'#8a9199'}}>
              전 세계 언어를 배우고 가르치는 플랫폼
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">서비스</h4>
            <ul className="space-y-2 text-sm" style={{color:'#8a9199'}}>
              <li><Link to="/tutors" className="hover:text-white transition-colors">튜터 찾기</Link></li>
              <li><Link to="/tutor/register" className="hover:text-white transition-colors">튜터 등록</Link></li>
              <li><Link to="/guide" className="hover:text-white transition-colors">이용 가이드</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm" style={{color:'#8a9199'}}>
              <li><Link to="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              <li><Link to="/policies" className="hover:text-white transition-colors">이용약관</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">회사</h4>
            <ul className="space-y-2 text-sm" style={{color:'#8a9199'}}>
              <li><Link to="/about" className="hover:text-white transition-colors">회사 소개</Link></li>
              <li><Link to="/partner" className="hover:text-white transition-colors">제휴 문의</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">채용</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-5 text-center text-[13px]" style={{borderTop:'1px solid #2a3447', color:'#6b7280'}}>
          <p>&copy; 2026 세계인들의 언어. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
