import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || '결제가 취소되었거나 오류가 발생했습니다.';
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">결제 실패</h2>
          {code && <p className="text-xs text-gray-400 mb-2">오류 코드: {code}</p>}
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도하기
            </button>
            <Link
              to="/"
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
