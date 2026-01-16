import { useEffect, useRef } from 'react';

const Robot = ({ isSearching }) => {
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);
    const leftHandRef = useRef(null);
    const rightHandRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (isSearching) return;

            const { clientX, clientY } = event;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / window.innerWidth * 12;
            const moveY = (clientY - centerY) / window.innerHeight * 12;

            if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isSearching]);

    return (
        <div className="w-64 h-64 md:w-96 md:h-96 relative flex items-center justify-center">
            <style>{`
        @keyframes typeLeft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes typeRight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .typing-left { animation: typeLeft 0.2s infinite; }
        .typing-right { animation: typeRight 0.2s infinite 0.1s; }
        
        /* 수정됨: X축 이동 없이 Y축으로만 둥실거림 */
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bubble-float { animation: floatBubble 2s ease-in-out infinite; }
      `}</style>
            <div className={`absolute top-[7%] left-1/2 -translate-x-1/2 z-20 transition-all duration-300 origin-bottom ${isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                <div className={isSearching ? 'bubble-float' : ''}>
                    <div className="relative bg-[#38BDF8] text-[#020617] px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.4)] whitespace-nowrap">
                        데이터베이스 분석 중... 🔍
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#38BDF8] rotate-45"></div>
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_50px_rgba(56,189,248,0.15)]">

                {/* --- 1. 책상 --- */}
                <rect x="40" y="155" width="10" height="40" className="fill-[#020617]" />
                <rect x="150" y="155" width="10" height="40" className="fill-[#020617]" />
                <rect x="10" y="145" width="180" height="15" rx="4" className="fill-[#1E293B]" />

                {/* --- 2. 로봇 몸체 --- */}
                <rect x="65" y="95" width="70" height="45" rx="10" className="fill-[#020617]" />
                <rect x="90" y="85" width="20" height="10" className="fill-[#334155]" />

                {/* --- 3. 로봇 머리 --- */}
                <g className={`transition-transform duration-300 ${isSearching ? 'translate-y-2' : ''}`}>
                    <rect x="45" y="85" width="10" height="16" rx="3" className="fill-[#020617] stroke-[#38BDF8]" strokeWidth="3" />
                    <rect x="145" y="85" width="10" height="16" rx="3" className="fill-[#020617] stroke-[#38BDF8]" strokeWidth="3" />

                    <path
                        d="M 55 75 L 55 103 Q 55 115 67 115 L 133 115 Q 145 115 145 103 L 145 75 A 45 30 0 0 0 55 75 Z"
                        className="fill-[#020617] stroke-[#38BDF8]"
                        strokeWidth="3"
                    />

                    {/* 얼굴 화면 (위치를 조금 아래로 조정 y=60 -> y=65) */}
                    <rect x="65" y="65" width="70" height="40" rx="4" className="fill-black" />

                    {/* 눈 (위치를 조금 아래로 조정 cy=80 -> cy=85) */}
                    <circle ref={leftPupilRef} cx="78" cy="85" r="7" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                    <circle ref={rightPupilRef} cx="122" cy="85" r="7" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                </g>

                {/* --- 4. 노트북 --- */}
                <path d="M70 140 L 130 140 L 135 150 L 65 150 Z" className="fill-[#475569]/70 stroke-[#64748b]/30" strokeWidth="1" />
                <rect x="65" y="107" width="70" height="40" rx="2" className="fill-[#64748b]/60 stroke-[#94a3b8]/30" strokeWidth="1" />
                <circle cx="100" cy="127" r="3" className={`fill-white/80 ${isSearching ? 'animate-pulse' : ''}`} />

                {/* --- 5. 손 --- */}
                <rect
                    ref={leftHandRef}
                    x="68" y="132" width="16" height="12" rx="4"
                    className={`fill-[#64748b] ${isSearching ? 'typing-left' : ''}`}
                />
                <rect
                    ref={rightHandRef}
                    x="116" y="132" width="16" height="12" rx="4"
                    className={`fill-[#64748b] ${isSearching ? 'typing-right' : ''}`}
                />
            </svg>
        </div>
    );
};

export default Robot;
