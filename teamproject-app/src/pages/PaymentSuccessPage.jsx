import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import httpClient from '../shared/api/httpClient';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (paymentKey && orderId && amount) {
      confirmPayment(paymentKey, orderId, amount);
    } else {
      setStatus('success');
    }
  }, []);

  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      await httpClient.post('/payments/toss/confirm', { paymentKey, orderId, amount: Number(amount) });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || '결제 확인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 중...</h2>
              <p className="text-gray-600">잠시만 기다려 주세요.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">결제가 완료되었습니다!</h2>
              <p className="text-gray-600 mb-6">예약이 성공적으로 처리되었습니다.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/mypage"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  내 예약 확인하기
                </Link>
                <Link
                  to="/"
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">결제 오류</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
