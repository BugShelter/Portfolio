import { useState, useEffect } from 'react';
import Robot from './Robot';

// --- 1. 네비게이션 메뉴 (AI INTERVIEW 메뉴 제거 -> HOME이 그 역할) ---
const Navbar = ({ activeSection }) => {
  const navLinks = [
    { id: 'home', label: 'AI HOME' }, // 이름 변경
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
              onClick={() => scrollToSection('home')}
              className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text cursor-pointer"
          >
            KYC.DEV
          </div>

          {/* 데스크탑 메뉴 */}
          <ul className="hidden md:flex gap-8">
            {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                      onClick={() => scrollToSection(link.id)}
                      className={`text-sm font-bold tracking-wider transition-colors duration-300 ${
                          activeSection === link.id
                              ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1'
                              : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    {link.label}
                  </button>
                </li>
            ))}
          </ul>
        </div>
      </nav>
  );
};

// --- 2. 섹션별 컴포넌트 ---

// [HERO SECTION] : 로봇 + AI 검색 + 자기소개 통합 (첫 페이지)
const HeroSection = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });
      if (!response.ok) throw new Error('Error');
      const data = await response.json();
      setAnswer(data.response);
    } catch (error) {
      setAnswer("죄송합니다. 서버 연결 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-20"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16 z-10">

          {/* 왼쪽: 로봇 (시선 따라가기) */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-end order-1 md:order-1 relative">
            <div className="relative hover:scale-105 transition-transform duration-500">
              <Robot />
              {/* 로봇 뒤 후광 효과 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            </div>
          </div>

          {/* 오른쪽: 텍스트 및 검색창 */}
          <div className="w-full md:w-7/12 order-2 md:order-2 text-center md:text-left">

            <div className="mb-8">
              <h2 className="text-cyan-500 font-mono tracking-widest text-sm mb-2">SYSTEM & BACKEND ENGINEER</h2>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                I'M <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">YEONCHEOL</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                반갑습니다. 로봇이 제 모든 포트폴리오를 학습했습니다.<br/>
                <span className="text-white font-bold">"기술 스택이 뭐야?"</span> 처럼 궁금한 것을 바로 물어보세요.
              </p>
            </div>

            {/* AI 검색창 */}
            <div className="w-full max-w-lg mx-auto md:mx-0">
              <form onSubmit={askAI} className="relative group mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="질문을 입력하세요 (예: 진행한 프로젝트 알려줘)"
                    className="relative w-full bg-slate-900 border border-slate-700 text-white pl-6 pr-14 py-4 rounded-xl shadow-2xl outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-all"
                />
                <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                  {loading ? <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full"></div> :
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>}
                </button>
              </form>

              {/* 답변 카드 (검색창 바로 아래 표시) */}
              <div className={`transition-all duration-500 ease-out origin-top ${answer ? 'scale-100 opacity-100 max-h-96' : 'scale-95 opacity-0 max-h-0 overflow-hidden'}`}>
                <div className="bg-slate-900/90 border border-slate-700 p-5 rounded-xl shadow-xl backdrop-blur-sm text-left relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 w-3 h-3 bg-slate-700 rotate-45 border-l border-t border-slate-600"></div>
                  <div className="flex gap-4">
                    <div className="min-w-[32px] h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">AI</div>
                    <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{answer}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
  );
};

// [ABOUT]
const AboutSection = () => (
    <section id="about" className="py-24 bg-slate-900/50 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
          <span className="w-12 h-1 bg-cyan-500"></span> ABOUT ME
        </h2>
        <div className="grid md:grid-cols-2 gap-12 text-slate-300">
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-cyan-400 font-bold mb-2">🎓 EDUCATION</h3>
              <p className="text-xl font-bold text-white">숭실대학교 졸업</p>
              <p>AI 융합학부 (공학사)</p>
              <p className="text-sm text-slate-400 mt-2">학점: 3.98 / 4.5 (전공 4.03)</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-cyan-400 font-bold mb-2">🏆 AWARDS</h3>
              <p className="font-bold text-white">스마트경진대회 최우수상 (2018)</p>
              <p className="text-sm text-slate-400">라즈베리파이를 활용한 3D 모션 캡처</p>
            </div>
          </div>
          <div className="leading-loose text-lg">
            <p className="mb-4">
              안녕하세요, <strong className="text-white">백엔드 및 시스템 엔지니어 김연철</strong>입니다.
            </p>
            <p className="mb-4">
              C/C++ 기반의 로우 레벨 시스템부터 Python, Java를 활용한 웹 서비스까지
              폭넓은 기술 스택을 보유하고 있습니다.
            </p>
            <p>
              단순히 코드를 작성하는 것을 넘어, <span className="text-cyan-400">메모리 최적화</span>와 <span className="text-cyan-400">성능 튜닝</span>에 깊은 관심을 가지고 있으며,
              현재 Arcus(DB 캐시) 솔루션을 개발하며 대용량 트래픽 처리를 경험하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
);

// [SKILLS]
const SkillsSection = () => {
  const skills = [
    { name: "C / C++", pct: 85, color: "bg-blue-500" },
    { name: "Perl", pct: 90, color: "bg-cyan-500" },
    { name: "Python", pct: 75, color: "bg-green-500" },
    { name: "Java / Spring", pct: 70, color: "bg-orange-500" },
    { name: "Linux / System", pct: 80, color: "bg-purple-500" },
  ];

  return (
      <section id="skills" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
            <span className="w-12 h-1 bg-cyan-500"></span> SKILLS
          </h2>
          <div className="space-y-8">
            {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2 text-slate-300 font-mono">
                    <span>{skill.name}</span>
                    <span>{skill.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.pct}%` }}
                    ></div>
                  </div>
                </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            {["Docker", "Git", "Github Actions", "Qdrant", "Redis", "MySQL", "OpenCV", "OpenGL"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-800 rounded-full text-slate-400 text-sm border border-slate-700">
                    # {tag}
                </span>
            ))}
          </div>
        </div>
      </section>
  );
};

// [EXPERIENCE]
const ExperienceSection = () => (
    <section id="experience" className="py-24 bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
          <span className="w-12 h-1 bg-cyan-500"></span> EXPERIENCE
        </h2>
        <div className="relative border-l-2 border-slate-700 ml-4 space-y-12">
          <div className="pl-8 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-cyan-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-white">잼투인 주식회사 (JaM2in)</h3>
            <p className="text-cyan-400 font-mono mb-4">2023.07 ~ 현재 | 서버 개발팀 (사원)</p>
            <ul className="list-disc list-outside text-slate-300 space-y-2 ml-4">
              <li><strong>Arcus (DB 캐시) 개발:</strong> ASCII/Binary 프로토콜 모듈화 및 메모리 최적화</li>
              <li><strong>Arcus C Client 개발:</strong> 메모리 누수 수정 및 라이브러리 링킹 문제 해결</li>
              <li><strong>Arcus Perl Client 개발:</strong> C-Perl 연동, CPAN 모듈 배포 및 문서화</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
);

// [PROJECTS]
const ProjectsSection = () => (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-4">
          <span className="w-12 h-1 bg-cyan-500"></span> PROJECTS
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-2">Arcus Perl Client</h3>
            <p className="text-sm text-slate-500 mb-4">2024.07 ~ 2024.09 (3인)</p>
            <p className="text-slate-300 text-sm mb-4">Perl 환경에서 Arcus Memcached를 사용할 수 있도록 클라이언트 라이브러리를 개발하고 CPAN에 배포.</p>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">Perl / C / Linux</span>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-2">자율 객체 추적 기기</h3>
            <p className="text-sm text-slate-500 mb-4">2022.08 ~ 2022.11 (개인)</p>
            <p className="text-slate-300 text-sm mb-4">라즈베리파이와 Yolo/Deepsort를 활용해 특정 객체를 실시간으로 추적하고 따라가는 기기 개발.</p>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">Python / C++ / UDP</span>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-2">3D 모션 캡처 시스템</h3>
            <p className="text-sm text-slate-500 mb-4">2018.07 ~ 2018.10 (3인)</p>
            <p className="text-slate-300 text-sm mb-4">카메라 영상을 OpenCV로 분석하여 사람의 움직임을 가상 3D 캐릭터에 실시간 매핑.</p>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">C++ / OpenGL / OpenCV</span>
          </div>
        </div>
      </div>
    </section>
);

// --- 3. 메인 APP (스크롤 로직) ---
function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // 이제 contact(마지막 섹션)는 없고 home이 메인입니다.
      const sections = ['home', 'about', 'skills', 'experience', 'projects'];

      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 헤더 높이 등을 고려해서 뷰포트 중앙쯤에 걸치면 활성화
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
        <Navbar activeSection={activeSection} />

        <main>
          {/* 맨 위로 올라온 Hero Section (로봇 + AI 검색) */}
          <HeroSection />

          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
        </main>

        <footer className="py-8 text-center text-slate-600 text-sm bg-slate-950 border-t border-slate-900">
          © 2025 Kim Yeoncheol. All rights reserved.
        </footer>
      </div>
  );
}

export default App;
