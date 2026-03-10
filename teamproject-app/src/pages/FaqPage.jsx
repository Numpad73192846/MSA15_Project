import { useState } from 'react';

const faqs = [
  { q: '수업은 어떻게 예약하나요?', a: '튜터 프로필 페이지에서 원하는 시간대를 선택하고 예약 버튼을 클릭하세요. 결제 완료 후 수업이 확정됩니다.' },
  { q: '수업 취소는 가능한가요?', a: '수업 24시간 전까지 취소가 가능하며, 전액 환불됩니다. 24시간 이내 취소 시 환불 정책이 적용됩니다.' },
  { q: '튜터는 어떻게 등록하나요?', a: '튜터로 회원가입 후 프로필을 완성하고 필요한 서류를 제출하면, 관리자 심사 후 활동을 시작할 수 있습니다.' },
  { q: '결제 방법은 무엇이 있나요?', a: '신용카드, 체크카드 등 주요 카드사를 통한 결제를 지원합니다.' },
  { q: '수업은 온라인으로 진행되나요?', a: '주로 Zoom을 통한 온라인 수업으로 진행됩니다. 튜터와 협의하여 오프라인 수업도 가능합니다.' },
  { q: '언어별로 튜터를 찾을 수 있나요?', a: '네, 튜터 목록에서 원하는 언어와 레벨로 검색하여 적합한 튜터를 찾을 수 있습니다.' },
  { q: '수업료는 어떻게 책정되나요?', a: '각 튜터가 자신의 수업료를 직접 설정합니다. 프로필 페이지에서 시간당 요금을 확인할 수 있습니다.' },
  { q: '리뷰는 언제 작성할 수 있나요?', a: '수업이 완료된 후 해당 튜터의 프로필에서 리뷰를 작성할 수 있습니다.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
          <p className="text-blue-100">궁금한 사항을 빠르게 확인하세요</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                <span className="text-gray-400 text-xl">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
