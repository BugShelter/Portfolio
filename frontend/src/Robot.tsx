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

            // 눈동자 움직임 제한 (범위가 너무 크면 눈 밖으로 나감)
            const moveX = (clientX - centerX) / window.innerWidth * 5;
            const moveY = (clientY - centerY) / window.innerHeight * 5;

            if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isSearching]);

    return (
        <div className="w-80 h-80 md:w-[450px] md:h-[450px] relative flex items-center justify-center">
            <style>{`
                @keyframes typeLeft {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-7px); }
                }
                @keyframes typeRight {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-7px); }
                }
                .typing-left { animation: typeLeft 0.15s infinite; }
                .typing-right { animation: typeRight 0.15s infinite 0.07s; }
            
                .robot-hand {
                  fill: #c7d8db;           /* 손 안쪽 색상 */
                  stroke: #251a15;         /* 테두리 색상 */
                  stroke-width: 2px;       /* 테두리 두께 */
                }
                
                @keyframes floatBubble {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
                .bubble-float { animation: floatBubble 2s ease-in-out infinite; }
            `}</style>

            {/* 1. 말풍선 */}
            <div className={`absolute top-[5%] left-1/2 -translate-x-1/2 z-40 transition-all duration-300 origin-bottom ${isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                <div className={isSearching ? 'bubble-float' : ''}>
                    <div className="relative bg-[#38BDF8] text-[#020617] px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.5)] whitespace-nowrap">
                        데이터베이스 분석 중... 🔍
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#38BDF8] rotate-45"></div>
                    </div>
                </div>
            </div>

            {/* 2. 로봇 몸체 이미지 */}
            <img
                src="/robot.png"
                alt="Robot Body"
                className="absolute inset-0 w-full h-full object-contain z-0 transform scale-110"
            />

            {/* 3. 노트북 이미지 (추가된 부분) */}
            <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 w-[40%] z-20">
                <img
                    src="/laptop.png"
                    alt="Laptop"
                    className={`w-full h-auto drop-shadow-2xl transition-all`}
                />
            </div>

            {/* 4. SVG 레이어 (눈동자와 손) */}
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            >
                {/* 눈동자 (기존과 동일) */}
                <g>
                    <circle ref={leftPupilRef} cx="87" cy="77" r="4" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                    <circle ref={rightPupilRef} cx="112" cy="77" r="4" className={`transition-colors duration-300 ${isSearching ? 'fill-yellow-400' : 'fill-[#38BDF8]'}`} />
                </g>

                {/* 손: y="142" 정도로 노트북 자판 높이에 밀착시킴 */}
                <g>
                    {/* 왼쪽 손 */}
                    <circle
                        ref={leftHandRef}
                        cx="73"
                        cy="115"
                        r="8"
                        className={`robot-hand origin-bottom ${isSearching ? 'typing-left' : ''}`}
                    />
                    {/* 오른쪽 손 */}
                    <circle
                        ref={rightHandRef}
                        cx="127"
                        cy="145"
                        r="8"
                        className={`robot-hand origin-bottom ${isSearching ? 'typing-right' : ''}`}
                    />
                </g>
            </svg>
        </div>
    );
};

export default Robot;
