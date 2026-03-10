import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-full">
        <div className="flex justify-between h-full items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/img/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold" style={{color:'var(--primary-color)'}}></span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/tutors" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-[1.125rem]">
                튜터 찾기
              </Link>
              <Link to="/guide" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-[1.125rem]">
                가이드
              </Link>
              <Link to="/game/korean" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-[1.125rem]">
                게임
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ROLE_TUTOR' && (
                  <Link
                    to="/tutor/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    대시보드
                  </Link>
                )}
                {user.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    관리자
                  </Link>
                )}
                <Link
                  to="/mypage"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/join"
                  className="min-w-[96px] h-[43px] px-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
