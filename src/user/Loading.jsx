import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Camera, 
    Sparkles, 
    Search,
    FileText
} from 'lucide-react';
import styles from './Loading.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');
    
    // 상태 관리
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isApiCompleted, setIsApiCompleted] = useState(false);
    
    // useEffect 중복 실행 방지
    const effectRan = useRef(false);
    const animationRef = useRef(null);
    const { patientInfo, uploadedFile } = location.state || {};

    // 분석 단계 정의
    const analysisSteps = [
        { icon: Camera, message: "이미지를 꼼꼼히 살펴보고 있어요" },
        { icon: Sparkles, message: "AI가 열심히 분석 중이에요" },
        { icon: Search, message: "병변 영역을 찾고 있어요" },
        { icon: FileText, message: "진단 결과를 정리하고 있어요" }
    ];

    // 애니메이션 시작 함수
    const startProgressAnimation = () => {
        const totalSteps = analysisSteps.length;
        let currentProgress = 0;

        const animate = () => {
            // API가 완료되면 애니메이션을 100%로 완료
            if (isApiCompleted) {
                setProgress(100);
                setCurrentStep(totalSteps - 1);
                return;
            }

            // 현재 단계 계산
            const newStep = Math.min(Math.floor(currentProgress / (100 / totalSteps)), totalSteps - 1);
            setCurrentStep(newStep);

            // 진행률 업데이트 (API 완료 전까지는 95%까지만)
            if (currentProgress < 95) {
                currentProgress += Math.random() * 2 + 0.3; // 0.3~2.3% 랜덤 증가
                currentProgress = Math.min(currentProgress, 95);
                setProgress(currentProgress);
            }

            // 다음 프레임 예약
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    useEffect(() => {
        // Strict Mode 중복 실행 방지
        if (effectRan.current === true) {
            return;
        }

        // 필수 데이터가 없으면 분석 페이지로 리다이렉트
        if (!patientInfo || !uploadedFile) {
            navigate('/analysis');
            return;
        }

        // 애니메이션 시작
        startProgressAnimation();

        // API 호출 시작
        const startAnalysis = async () => {
            try {
                if (!accessToken) {
                    alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                    navigate('/login');
                    return;
                }

                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('name', patientInfo.name);
                formData.append('patientCode', patientInfo.patientCode);
                formData.append('birthDate', patientInfo.birthDate);
                formData.append('gender', patientInfo.gender === '남성' ? 'M' : 'F');
                formData.append('bloodType', patientInfo.bloodType);
                formData.append('height', patientInfo.height);
                formData.append('weight', patientInfo.weight);

                let response = await fetch(`${SERVER_URL}/diagnosis/start/new-patient`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: formData
                });

                // new-patient가 실패하면 existing-patient로 재시도
                if (!response.ok) {
                    console.warn("new-patient 요청 실패, patientId를 조회합니다");
                    response = await fetch(`${SERVER_URL}/patients/code/${encodeURIComponent(patientInfo.patientCode)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    const data = await response.json();
                    const patientId = data.patientId;

                    const existingPatientForm = new FormData();
                    existingPatientForm.append('file', uploadedFile);
                    existingPatientForm.append('patientId', patientId);

                    response = await fetch(`${SERVER_URL}/diagnosis/start/existing-patient`, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                        },
                        body: existingPatientForm,
                    });
                }

                const result = await response.json();
                console.log('백엔드 실제 응답:', result);

                // API 완료 표시
                setIsApiCompleted(true);
                
                console.log('API 완료! result로 이동 준비:', result);

                // 100% 완료 후 약간의 대기 시간 후 이동
                setTimeout(() => {
                    console.log('result 페이지로 이동 시작');
                    navigate('/result', {
                        state: {
                            patientInfo,
                            uploadedFile,
                            imagePreview: URL.createObjectURL(uploadedFile), // 이미지 미리보기
                            analysisResult: {
                                // 시뮬레이션된 AI 분석 결과 (원본과 동일)
                                probability: {
                                    normal: 15,
                                    pneumonia: 75,
                                    tuberculosis: 8,
                                    other: 2
                                },
                                severity: "중등도",
                                recommendation: "추가 검사 권장",
                                confidence: 87,
                                detectedAreas: [
                                    { x: 45, y: 30, width: 20, height: 15, type: "pneumonia" },
                                    { x: 60, y: 45, width: 12, height: 10, type: "inflammation" }
                                ]
                            },
                            patient: result // 백엔드 실제 응답도 포함
                        }
                    });
                    console.log('navigate 호출 완료');
                }, 1000);

            } catch (error) {
                console.error("AI 분석 요청 실패:", error);
                setIsApiCompleted(true); // 에러 시에도 애니메이션 중단
                
                if (error.response && error.response.status === 401) {
                    alert("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
                    navigate('/login');
                } else {
                    alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
                    // navigate(-1); // 이 부분을 주석처리하고 테스트
                    console.log("에러 발생, result 페이지로 이동 (테스트용)");
                    navigate('/result', {
                        state: { 
                            patient: {
                                // 테스트용 더미 데이터
                                patientId: 1,
                                name: patientInfo.name,
                                diagnosisResults: [{
                                    imageId: 1,
                                    top1Disease: "폐렴",
                                    top1Probability: 0.75,
                                    top2Disease: "정상",
                                    top2Probability: 0.15,
                                    top3Disease: "결핵",
                                    top3Probability: 0.08
                                }]
                            },
                            patientInfo: patientInfo,
                            uploadedFile: uploadedFile,
                            analysisResult: {
                                // 테스트용 분석 결과
                                probability: {
                                    normal: 15,
                                    pneumonia: 75,
                                    tuberculosis: 8,
                                    other: 2
                                }
                            }
                        }
                    });
                }
            }
        };

        startAnalysis();

        // 클린업 함수
        return () => {
            effectRan.current = true;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    if (!patientInfo || !uploadedFile) {
        return null;
    }

    const currentStepData = analysisSteps[currentStep] || analysisSteps[0];
    const CurrentIcon = currentStepData.icon;

    return (
        <div className={styles.container}>
            <div className={styles.loadingWrapper}>
                <div className={styles.iconContainer}>
                    <CurrentIcon size={64} className={styles.animatedIcon} />
                </div>
                
                <h1 className={styles.title}>
                    AI 분석 진행 중
                </h1>
                
                <p className={styles.message}>
                    {currentStepData.message}
                </p>
                
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                <div className={styles.progressText}>
                    {Math.round(progress)}% 완료
                </div>
                
                <div className={styles.estimatedTime}>
                    예상 소요 시간: 약 {Math.max(1, Math.ceil((100 - progress) / 20))}분
                </div>
            </div>
        </div>
    );
}

export default Loading;