import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">세계인들의 언어</h3>
            <p className="text-sm">
              전 세계 언어를 배우고 가르치는 플랫폼
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tutors" className="hover:text-white transition-colors">튜터 찾기</Link></li>
              <li><Link to="/tutor/register" className="hover:text-white transition-colors">튜터 등록</Link></li>
              <li><Link to="/guide" className="hover:text-white transition-colors">이용 가이드</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              <li><Link to="/guide/policies" className="hover:text-white transition-colors">이용약관</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">회사</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">회사 소개</Link></li>
              <li><Link to="/partnership" className="hover:text-white transition-colors">제휴 문의</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">채용</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2026 세계인들의 언어. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
