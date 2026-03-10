import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../shared/api/httpClient';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (!user.authList?.some(a => a.auth === 'ROLE_ADMIN') && user.role !== 'ROLE_ADMIN') {
        navigate('/');
      } else {
        fetchAll();
      }
    }
  }, [user, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [docsRes, usersRes, settlementsRes] = await Promise.allSettled([
        httpClient.get('/admin/documents'),
        httpClient.get('/admin/users'),
        httpClient.get('/admin/settlements'),
      ]);
      if (docsRes.status === 'fulfilled') setDocuments(docsRes.value.data.data || docsRes.value.data || []);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data.data || usersRes.value.data || []);
      if (settlementsRes.status === 'fulfilled') setSettlements(settlementsRes.value.data.data || settlementsRes.value.data || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const approveDocument = async (id) => {
    try {
      await httpClient.post('/admin/documents/approve', { id });
      fetchAll();
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const rejectDocument = async () => {
    if (!rejectTarget) return;
    try {
      await httpClient.post('/admin/documents/reject', { id: rejectTarget, reason: rejectReason });
      setRejectTarget(null);
      setRejectReason('');
      fetchAll();
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await httpClient.patch(`/admin/users/${id}/status`, { status });
      fetchAll();
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await httpClient.delete(`/admin/users/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const remitSettlement = async (tutorId) => {
    try {
      await httpClient.post('/admin/settlements/remit', { tutorId });
      fetchAll();
    } catch (err) {
      console.error('Remit failed', err);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  const tabs = [
    { key: 'documents', label: `서류 심사 (${documents.length})` },
    { key: 'users', label: `회원 관리 (${users.length})` },
    { key: 'settlements', label: `정산 관리 (${settlements.length})` },
  ];

  const docTypeLabel = { EDUCATION: '재학증명서', DEGREE: '학위증', CERTIFICATE: '자격증', CERTIFICATE_TEXT: '자격증(텍스트)' };
  const docStatusClass = (s) => ({
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100 text-gray-800');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">관리자 페이지</h1>

        {/* 탭 */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 서류 심사 */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">서류 심사</h2>
            {documents.length === 0 ? (
              <p className="text-gray-500">심사할 서류가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">튜터 ID</th>
                      <th className="text-left py-3 px-4">서류 유형</th>
                      <th className="text-left py-3 px-4">파일명</th>
                      <th className="text-left py-3 px-4">상태</th>
                      <th className="text-left py-3 px-4">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600 text-xs">{doc.userId?.slice(0, 8)}...</td>
                        <td className="py-3 px-4">{docTypeLabel[doc.docType] || doc.docType}</td>
                        <td className="py-3 px-4">
                          {doc.filePath ? (
                            <a href={`http://localhost:8080${doc.filePath}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {doc.originalName || '파일 보기'}
                            </a>
                          ) : (
                            <span>{doc.originalName || '-'}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${docStatusClass(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {doc.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveDocument(doc.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => setRejectTarget(doc.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                              >
                                거절
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 거절 모달 */}
            {rejectTarget && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">서류 거절 사유</h3>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="거절 사유를 입력하세요"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => { setRejectTarget(null); setRejectReason(''); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={rejectDocument}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      거절 확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 회원 관리 */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">회원 관리</h2>
            {users.length === 0 ? (
              <p className="text-gray-500">회원이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">아이디</th>
                      <th className="text-left py-3 px-4">이름</th>
                      <th className="text-left py-3 px-4">역할</th>
                      <th className="text-left py-3 px-4">상태</th>
                      <th className="text-left py-3 px-4">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id || u.no} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{u.username}</td>
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{u.role || (u.authList?.[0]?.auth)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {u.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {u.status !== 'SUSPENDED' && (
                              <button
                                onClick={() => updateUserStatus(u.id, 'SUSPENDED')}
                                className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                              >
                                정지
                              </button>
                            )}
                            {u.status === 'SUSPENDED' && (
                              <button
                                onClick={() => updateUserStatus(u.id, 'ACTIVE')}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                활성화
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 정산 관리 */}
        {activeTab === 'settlements' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">정산 관리</h2>
            {settlements.length === 0 ? (
              <p className="text-gray-500">정산 내역이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">튜터</th>
                      <th className="text-left py-3 px-4">정산 금액</th>
                      <th className="text-left py-3 px-4">상태</th>
                      <th className="text-left py-3 px-4">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((s, i) => (
                      <tr key={s.tutorId || i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{s.tutorName || s.tutorId}</td>
                        <td className="py-3 px-4 font-semibold">
                          {Number(s.amount || 0).toLocaleString()}원
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${s.remitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {s.remitted ? '지급완료' : '대기'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {!s.remitted && (
                            <button
                              onClick={() => remitSettlement(s.tutorId)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              지급처리
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
