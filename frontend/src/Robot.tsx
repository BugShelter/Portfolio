import { useEffect, useRef } from 'react';

const Robot = () => {
    // 눈동자(Pupil) 요소에 직접 접근하기 위한 Ref
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);

    useEffect(() => {
        // 마우스 움직임 핸들러
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;

            // 화면 중앙 기준점 계산
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // 마우스 위치가 중앙에서 얼마나 떨어졌는지 비율 계산 (-0.5 ~ 0.5 범위)
            // 이 비율에 곱하는 숫자(여기선 20)가 눈동자의 최대 이동 거리입니다.
            const moveX = (clientX - centerX) / window.innerWidth * 20;
            const moveY = (clientY - centerY) / window.innerHeight * 20;

            // 왼쪽 눈동자 이동
            if (leftPupilRef.current) {
                leftPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            // 오른쪽 눈동자 이동 (약간의 차이를 주면 더 자연스럽지만 심플하게 같이 이동)
            if (rightPupilRef.current) {
                rightPupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('mousemove', handleMouseMove);

        // 클린업 함수 (컴포넌트가 사라질 때 리스너 제거)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        // Tailwind 클래스로 로봇 크기 및 애니메이션 조절 (마우스 올리면 살짝 떠오름)
        <div className="w-64 h-64 md:w-96 md:h-96 transition-transform duration-500 hover:-translate-y-4">
            {/* 로봇 SVG 디자인 */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 몸통 & 머리 프레임 */}
                <rect x="40" y="40" width="120" height="120" rx="20" className="fill-slate-800 stroke-blue-500" strokeWidth="4" />
                <rect x="60" y="160" width="80" height="30" rx="5" className="fill-slate-700" />

                {/* 안테나 */}
                <line x1="100" y1="40" x2="100" y2="10" className="stroke-blue-500" strokeWidth="4" />
                <circle cx="100" cy="10" r="8" className="fill-blue-400 animate-pulse" />

                {/* 얼굴 화면 영역 */}
                <rect x="55" y="60" width="90" height="70" rx="10" className="fill-slate-900" />

                {/* --- 왼쪽 눈 --- */}
                {/* 눈 흰자위 (고정) */}
                <circle cx="80" cy="95" r="15" className="fill-slate-200" />
                {/* 눈동자 (움직임) - ref 연결 */}
                <circle ref={leftPupilRef} cx="80" cy="95" r="7" className="fill-blue-600 transition-transform duration-75 ease-out" />

                {/* --- 오른쪽 눈 --- */}
                {/* 눈 흰자위 (고정) */}
                <circle cx="120" cy="95" r="15" className="fill-slate-200" />
                {/* 눈동자 (움직임) - ref 연결 */}
                <circle ref={rightPupilRef} cx="120" cy="95" r="7" className="fill-blue-600 transition-transform duration-75 ease-out" />

                {/* 입 */}
                <path d="M85 115H115" className="stroke-blue-400" strokeWidth="3" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default Robot;
