import { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // 백엔드 요청 함수
  const askAI = async (e) => {
    e.preventDefault(); // 엔터 키 입력 시 새로고침 방지
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(''); // 기존 답변 초기화

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });

      if (!response.ok) throw new Error('서버 연결 실패');

      const data = await response.json();
      setAnswer(data.response); // 백엔드에서 보낸 필드명 (response)
    } catch (error) {
      console.error(error);
      setAnswer("죄송합니다. 서버와 연결할 수 없어요. 😭");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">

        {/* 1. 메인 타이틀 (이름이나 포트폴리오 제목) */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2">
            YeonCheol's AI Portfolio
          </h1>
          <p className="text-slate-400">무엇이든 물어보세요, AI가 대신 대답해드립니다.</p>
        </div>

        {/* 2. 검색창 영역 (메인) */}
        <div className="w-full max-w-2xl relative z-10">
          <form onSubmit={askAI} className="relative group">
            {/* 검색 아이콘 */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>

            {/* 입력 필드 */}
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 이 개발자의 주 기술 스택은 뭐야?"
                className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-100 pl-12 pr-16 py-4 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg placeholder:text-slate-500"
            />

            {/* 전송 버튼 (입력값이 있을 때만 진하게 표시) */}
            <button
                type="submit"
                disabled={loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                    question.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
              {loading ? (
                  // 로딩 스피너
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
              ) : (
                  // 화살표 아이콘
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              )}
            </button>
          </form>

          {/* 3. 추천 질문 (칩 스타일) - 질문하기 귀찮을 때 클릭 유도 */}
          {!answer && !loading && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["기술 스택 알려줘", "진행한 프로젝트는?", "연락처가 어떻게 돼?", "자기소개 부탁해"].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => { setQuestion(tag); }}
                        className="px-4 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-700 hover:border-slate-500 transition-colors text-slate-300"
                    >
                      {tag}
                    </button>
                ))}
              </div>
          )}
        </div>

        {/* 4. 답변 영역 (답변이 있을 때만 표시) */}
        {answer && (
            <div className="w-full max-w-2xl mt-8 animate-fade-in-up">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  {/* AI 아이콘 */}
                  <div className="min-w-[40px] w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  </div>

                  {/* 답변 텍스트 */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-400 mb-1">Portfolio AI</h3>
                    <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* 배경 장식 (은은한 빛) */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>

      </div>
  );
}

export default App;