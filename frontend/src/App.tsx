import { useState } from 'react';
import Robot from './Robot';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    // setAnswer(''); // 답변 누적을 원하면 주석 해제

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });

      if (!response.ok) throw new Error('서버 연결 실패');

      const data = await response.json();
      setAnswer(data.response);
    } catch (error) {
      console.error(error);
      setAnswer("죄송합니다. 서버와 연결할 수 없어요. 😭");
    } finally {
      setLoading(false);
    }
  };

  return (
      // 배경색: PDF의 어두운 톤(Slate-950) 유지
      <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row text-slate-200 font-sans selection:bg-cyan-500 selection:text-white overflow-hidden">

        {/* 🤖 왼쪽: 로봇 영역 */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 relative perspective-1000">
          <Robot />
          {/* PDF 차트 색상(Cyan/Blue)을 배경 빛으로 사용 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse"></div>
        </div>

        {/* 💻 오른쪽: 인터페이스 영역 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative z-10">

          {/* 타이틀 영역 */}
          <div className="mb-8">
            <h2 className="text-cyan-400 font-mono text-sm mb-2 tracking-widest uppercase">System Engineer Portfolio</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              KIM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">YEONCHEOL</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              <span className="text-cyan-400 font-bold">Arcus DB</span> 및 <span className="text-blue-400 font-bold">임베디드 시스템</span> 개발자입니다.<br/>
              왼쪽의 AI 로봇에게 제 이력을 물어보세요.
            </p>
          </div>

          {/* 검색창 */}
          <form onSubmit={askAI} className="relative group w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 잼투인에서 무슨 일 했어?"
                className="relative w-full bg-slate-900 border border-slate-700 text-slate-100 pl-6 pr-14 py-4 rounded-xl shadow-2xl outline-none focus:border-cyan-500/50 transition-all text-base placeholder:text-slate-600"
            />

            <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                  <svg className="animate-spin w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
              )}
            </button>
          </form>

          {/* 추천 질문 태그 */}
          {!answer && !loading && (
              <div className="mt-4 flex flex-wrap gap-2">
                {["기술 스택은?", "Arcus 프로젝트 설명해줘", "수상 경력 알려줘"].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setQuestion(tag)}
                        className="px-3 py-1 text-xs font-mono text-cyan-600 bg-cyan-950/30 border border-cyan-900/50 rounded hover:bg-cyan-900/50 hover:text-cyan-300 transition-colors"
                    >
                      # {tag}
                    </button>
                ))}
              </div>
          )}

          {/* 답변 카드 */}
          <div className={`mt-8 transition-all duration-500 ease-out ${answer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {answer && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                    <div className="flex gap-4">
                      <div className="min-w-[40px] h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

        </div>
      </div>
  );
}

export default App;
