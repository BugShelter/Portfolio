import { useState } from 'react';
import Robot from './Robot'; // 👈 1. Robot 컴포넌트 임포트

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // 백엔드 요청 함수 (기존과 동일)
  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    // setAnswer(''); // 답변을 누적해서 보여주거나 대화형으로 하려면 주석 처리

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
      // 전체 컨테이너: flex로 좌우 배치, 높이 100vh
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">

        {/* 👈 왼쪽 영역: 로봇 (화면 절반 차지) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 relative perspective-1000">
          <Robot />
          {/* 배경 장식 효과 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </div>

        {/* 👉 오른쪽 영역: 채팅 인터페이스 (화면 절반 차지) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative z-10">

          {/* 타이틀 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-3">
              AI 포트폴리오 도슨트
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              왼쪽의 로봇이 제 데이터를 학습했습니다.<br/>궁금한 점을 물어보세요!
            </p>
          </div>

          {/* 작은 검색창 스타일 입력 칸 */}
          <form onSubmit={askAI} className="relative group w-full max-w-lg">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하고 엔터를 누르세요..."
                className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-slate-100 pl-6 pr-14 py-3 rounded-xl shadow-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base placeholder:text-slate-600"
            />

            {/* 전송 버튼 (로딩 인디케이터 포함) */}
            <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                  <svg className="animate-spin w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                  </svg>
              )}
            </button>
          </form>

          {/* 답변 영역 (검색창 밑에 작게 나타남) */}
          <div className={`mt-6 transition-all duration-500 ${answer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {answer && (
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 shadow-xl backdrop-blur-sm max-w-lg">
                  <div className="flex items-start gap-3">
                    <div className="min-w-[24px] text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 0 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </div>
                  </div>
                </div>
            )}
          </div>

        </div> {/* End of 오른쪽 영역 */}

      </div>
  );
}

export default App;
