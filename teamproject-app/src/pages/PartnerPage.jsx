import { useState } from 'react';

export default function PartnerPage() {
  const [form, setForm] = useState({ company: '', contact: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">제휴 문의</h1>
          <p className="text-xl text-blue-100">함께 성장할 파트너를 기다립니다</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🏢', title: '교육 기관', desc: '학교, 학원, 교육 단체와의 파트너십을 환영합니다.' },
            { icon: '💼', title: '기업 교육', desc: '임직원 언어 교육 프로그램을 제공합니다.' },
            { icon: '🌐', title: '플랫폼 연동', desc: 'API 연동 및 화이트레이블 솔루션을 제공합니다.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        {submitted ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문의가 접수되었습니다</h2>
            <p className="text-gray-600">담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold mb-6">제휴 문의하기</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자명</label>
                  <input type="text" name="contact" value={form.contact} onChange={handleChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                문의 제출
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
