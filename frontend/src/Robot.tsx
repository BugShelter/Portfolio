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

            const moveX = (clientX - centerX) / window.innerWidth * 4;
            const moveY = (clientY - centerY) / window.innerHeight * 4;

            if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isSearching]);

    return (
        /* --- 1. 부모 컨테이너 크기 키움 (w-80, h-80 및 md:w-[500px] 등) --- */
        <div className="w-80 h-80 md:w-[450px] md:h-[450px] relative flex items-center justify-center">
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
                
                @keyframes floatBubble {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-5px); }
                }
                .bubble-float { animation: floatBubble 2s ease-in-out infinite; }
            `}</style>

            {/* 말풍선 위치 조정 */}
            <div className={`absolute top-[5%] left-1/2 -translate-x-1/2 z-30 transition-all duration-300 origin-bottom ${isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                <div className={isSearching ? 'bubble-float' : ''}>
                    <div className="relative bg-[#38BDF8] text-[#020617] px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.4)] whitespace-nowrap">
                        데이터베이스 분석 중... 🔍
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#38BDF8] rotate-45"></div>
                    </div>
                </div>
            </div>

            {/* --- 2. 로봇 이미지 크기 최적화 --- */}
            <img
                src="/robot.png"
                alt="Robot Body"
                /* scale-110을 추가하면 컨테이너보다 살짝 더 크게 출력됩니다 */
                className="absolute inset-0 w-full h-full object-contain z-0 transform scale-120"
            />

            {/* --- 3. SVG 레이어 (viewBox 덕분에 부모가 커지면 같이 커집니다) --- */}
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10"
            >
                {/* 눈동자 */}
                <g>
                    <circle ref={leftPupilRef} cx="87" cy="77" r="4" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                    <circle ref={rightPupilRef} cx="112" cy="77" r="4" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                </g>

                {/* 노트북 */}
                <path d="M80 145 L 120 145 L 122 150 L 78 150 Z" className="fill-[#475569]/80 stroke-[#64748b]/30" strokeWidth="1" />
                <rect x="82" y="120" width="36" height="25" rx="2" className="fill-[#64748b]/70 stroke-[#94a3b8]/30" strokeWidth="1" />
                <circle cx="100" cy="132" r="3" className={`fill-white/80 ${isSearching ? 'animate-pulse' : ''}`} />

                {/* 손 */}
                <rect ref={leftHandRef} x="62" y="137" width="16" height="16" rx="4" className={`fill-[#64748b] ${isSearching ? 'typing-left' : ''}`} />
                <rect ref={rightHandRef} x="122" y="137" width="16" height="16" rx="4" className={`fill-[#64748b] ${isSearching ? 'typing-right' : ''}`} />
            </svg>
        </div>
    );
};

export default Robot;
