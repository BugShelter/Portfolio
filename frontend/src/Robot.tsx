import { useEffect, useRef } from 'react';

const Robot = ({ isSearching }) => {
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            // 검색 중일 때는 마우스를 따라가지 않고 화면을 봄
            if (isSearching) {
                if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(0px, 3px)`;
                if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(0px, 3px)`;
                return;
            }

            const { clientX, clientY } = event;
            const centerX = window.innerWidth / 2; // 화면 왼쪽 절반의 중앙 대략 계산
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / window.innerWidth * 15;
            const moveY = (clientY - centerY) / window.innerHeight * 15;

            if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isSearching]); // isSearching이 바뀔 때마다 동작 갱신

    return (
        <div className="w-64 h-64 md:w-96 md:h-96 relative">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* --- 1. 로봇 몸체 (책상 뒤) --- */}
                <rect x="60" y="80" width="80" height="90" rx="10" className="fill-slate-800" />

                {/* 머리 연결부 */}
                <rect x="90" y="70" width="20" height="10" className="fill-slate-600" />

                {/* --- 2. 로봇 머리 --- */}
                <g className={`transition-transform duration-500 ${isSearching ? 'translate-y-1' : 'translate-y-0'}`}>
                    {/* 안테나 */}
                    <line x1="100" y1="40" x2="100" y2="10" className="stroke-slate-500" strokeWidth="3" />
                    <circle cx="100" cy="10" r="6" className={`fill-cyan-400 ${isSearching ? 'animate-ping' : ''}`} />

                    {/* 얼굴 형태 */}
                    <rect x="50" y="30" width="100" height="80" rx="15" className="fill-slate-800 stroke-cyan-600" strokeWidth="3" />

                    {/* 눈 배경 (검은 화면) */}
                    <rect x="60" y="50" width="80" height="40" rx="5" className="fill-slate-900" />

                    {/* 왼쪽 눈 */}
                    <circle cx="80" cy="70" r="12" className="fill-slate-700" />
                    <circle ref={leftPupilRef} cx="80" cy="70" r="5" className="fill-cyan-400 transition-transform duration-100" />

                    {/* 오른쪽 눈 */}
                    <circle cx="120" cy="70" r="12" className="fill-slate-700" />
                    <circle ref={rightPupilRef} cx="120" cy="70" r="5" className="fill-cyan-400 transition-transform duration-100" />
                </g>

                {/* --- 3. 팔 (검색 중일 때만 움직임) --- */}
                {/* 왼팔 */}
                <path
                    d="M60 140 Q 40 160 55 175"
                    className={`stroke-slate-500 fill-none ${isSearching ? 'animate-pulse' : ''}`}
                    strokeWidth="8" strokeLinecap="round"
                    style={{ animationDuration: '0.2s' }} // 타자 치는 속도
                />
                {/* 오른팔 */}
                <path
                    d="M140 140 Q 160 160 145 175"
                    className={`stroke-slate-500 fill-none ${isSearching ? 'animate-pulse' : ''}`}
                    strokeWidth="8" strokeLinecap="round"
                    style={{ animationDuration: '0.25s' }} // 양손 박자 다르게
                />

                {/* --- 4. 책상과 노트북 (맨 앞) --- */}

                {/* 책상 상판 */}
                <rect x="10" y="170" width="180" height="10" rx="2" className="fill-slate-700" />
                <rect x="20" y="180" width="160" height="20" className="fill-slate-800/50" />

                {/* 노트북 하판 */}
                <path d="M60 170 L 140 170 L 145 175 L 55 175 Z" className="fill-slate-400" />

                {/* 노트북 화면 (뒷면) */}
                <rect x="65" y="125" width="70" height="45" rx="3" className="fill-slate-300" />
                {/* 노트북 로고 (애플 패러디) */}
                <circle cx="100" cy="145" r="5" className={`fill-white ${isSearching ? 'animate-pulse' : ''}`} />

                {/* 노트북 화면 빛 (로봇 얼굴에 반사되는 효과) */}
                {isSearching && (
                    <path d="M65 125 L 135 125 L 180 200 L 20 200 Z" className="fill-cyan-500/10 animate-pulse" />
                )}

            </svg>
        </div>
    );
};

export default Robot;
