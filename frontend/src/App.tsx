import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: '서버 연결 실패. 백엔드가 켜져 있나요?' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col h-[600px] overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white font-bold text-center">
          🤖 연철님의 AI 포트폴리오
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[80%] text-sm ${
                m.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-xs ml-2">답변 생성 중...</div>}
          <div ref={endRef} />
        </div>
        <div className="p-4 bg-white border-t flex gap-2">
          <input
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="질문하세요..."
          />
          <button onClick={sendMessage} disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition">전송</button>
        </div>
      </div>
    </div>
  );
}
export default App;
