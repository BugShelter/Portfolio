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
      setMessages(prev => [...prev, { role: 'bot', text: '서버 연결 실패. 백엔드를 확인하세요.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col h-[700px]">
        <div className="p-5 bg-indigo-600 text-white font-bold text-lg rounded-t-xl">
          🚀 Java 21