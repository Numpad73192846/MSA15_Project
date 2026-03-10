export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">이용약관 및 정책</h1>
          <p className="text-blue-100">서비스 이용에 관한 약관을 확인하세요</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {[
          {
            title: '서비스 이용약관',
            content: `본 약관은 세계인들의 언어(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정합니다.

제1조 (목적)
이 약관은 회사가 제공하는 언어 학습 매칭 서비스의 이용조건 및 절차, 이용자와 회사 간의 권리·의무 및 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (이용자의 의무)
이용자는 서비스 이용 시 타인의 권리를 침해하거나 관련 법령을 위반하는 행위를 하여서는 안 됩니다.`,
          },
          {
            title: '개인정보처리방침',
            content: `회사는 이용자의 개인정보를 중요시하며, 관련 법령을 준수합니다.

수집하는 개인정보 항목: 이름, 이메일, 연락처 등
개인정보 수집 목적: 서비스 제공, 회원 관리
보유 및 이용 기간: 회원 탈퇴 시까지`,
          },
          {
            title: '환불 정책',
            content: `수업 취소 및 환불은 다음 정책에 따릅니다.

- 수업 24시간 이전 취소: 전액 환불
- 수업 12시간 이전 취소: 50% 환불
- 수업 12시간 이내 취소: 환불 불가
- 튜터의 귀책 사유로 인한 취소: 전액 환불`,
          },
        ].map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
