import { useState, useEffect } from 'react';
import httpClient from '../shared/api/httpClient';

export default function GamePage() {
  const [proverb, setProverb] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    fetchProverb();
  }, [round]);

  const fetchProverb = async () => {
    setLoading(true);
    setResult(null);
    setAnswer('');
    setHint(false);
    try {
      const res = await httpClient.get('/game/proverb/random');
      setProverb(res.data.data || res.data);
    } catch {
      setProverb({
        id: 1,
        question: '가는 말이 고와야 ?',
        answer: '오는 말이 곱다',
        meaning: '자신이 남에게 잘 대해야 남도 자신에게 잘 대한다는 뜻',
        choices: ['오는 말이 곱다', '뛰는 놈 위에 나는 놈 있다', '돌다리도 두들겨 보고 건너라', '백지장도 맞들면 낫다'],
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (selected) => {
    const correct = selected === (proverb?.answer || proverb?.correct);
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 10);
  };

  const nextRound = () => {
    setRound((r) => r + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">문제 로딩 중...</div>
      </div>
    );
  }

  const choices = proverb?.choices || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">한국어 속담 게임</h1>
          <p className="text-gray-600">빈칸에 들어갈 속담을 맞춰보세요!</p>
        </div>

        {/* 스코어 */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-xl shadow-sm px-6 py-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">라운드</div>
            <div className="text-2xl font-bold text-blue-600">{round}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">점수</div>
            <div className="text-2xl font-bold text-green-600">{score}점</div>
          </div>
        </div>

        {/* 문제 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="text-center mb-6">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
              속담 완성하기
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {proverb?.question || proverb?.proverbQuestion}
            </h2>
          </div>

          {/* 힌트 */}
          {hint && proverb?.meaning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
              💡 힌트: {proverb.meaning}
            </div>
          )}

          {/* 보기 */}
          {choices.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {choices.map((choice, i) => {
                let btnClass = 'w-full p-4 text-left border-2 rounded-lg transition-all font-medium ';
                if (result) {
                  if (choice === (proverb.answer || proverb.correct)) {
                    btnClass += 'border-green-500 bg-green-50 text-green-700';
                  } else if (choice === answer) {
                    btnClass += 'border-red-400 bg-red-50 text-red-700';
                  } else {
                    btnClass += 'border-gray-200 bg-gray-50 text-gray-400';
                  }
                } else {
                  btnClass += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
                }
                return (
                  <button
                    key={i}
                    onClick={() => { if (!result) { setAnswer(choice); checkAnswer(choice); } }}
                    className={btnClass}
                    disabled={!!result}
                  >
                    <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs text-center leading-6 mr-3">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {choice}
                  </button>
                );
              })}
            </div>
          ) : (
            /* 직접 입력 */
            <div className="space-y-3">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && answer && checkAnswer(answer)}
                disabled={!!result}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="답을 입력하고 Enter를 누르세요"
              />
              {!result && (
                <button
                  onClick={() => answer && checkAnswer(answer)}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  제출
                </button>
              )}
            </div>
          )}
        </div>

        {/* 결과 */}
        {result && (
          <div className={`rounded-xl p-6 mb-6 text-center ${result === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-4xl mb-2">{result === 'correct' ? '🎉' : '😢'}</div>
            <h3 className={`text-xl font-bold mb-2 ${result === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
              {result === 'correct' ? '정답입니다! +10점' : '틀렸습니다'}
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              <strong>정답:</strong> {proverb?.answer || proverb?.correct}
            </p>
            {proverb?.meaning && (
              <p className="text-gray-500 text-sm">{proverb.meaning}</p>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          {!hint && !result && (
            <button
              onClick={() => setHint(true)}
              className="flex-1 py-3 border-2 border-blue-300 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              힌트 보기
            </button>
          )}
          {result && (
            <button
              onClick={nextRound}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              다음 문제 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
