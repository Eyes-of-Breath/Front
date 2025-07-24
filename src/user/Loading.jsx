import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Camera, 
    Sparkles, 
    Search,
    FileText
} from 'lucide-react';
import styles from './Loading.module.css';

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    
    // 이전 페이지에서 전달받은 데이터
    const { patientInfo, uploadedFile, imagePreview } = location.state || {};

    const analysisSteps = [
        { icon: Camera, message: "이미지를 꼼꼼히 살펴보고 있어요", duration: 1000 },
        { icon: Sparkles, message: "AI가 열심히 분석 중이에요", duration: 2000 },
        { icon: Search, message: "병변 영역을 찾고 있어요", duration: 1500 },
        { icon: FileText, message: "진단 결과를 정리하고 있어요", duration: 1000 }
    ];

    useEffect(() => {
        // 데이터가 없으면 업로드 페이지로 리다이렉트
        if (!patientInfo || !uploadedFile) {
            navigate('/analysis');
            return;
        }

        let stepTimeout;
        let progressInterval;

        const runAnalysis = async () => {
            for (let i = 0; i < analysisSteps.length; i++) {
                setCurrentStep(i);
                
                // 각 단계별 진행률 업데이트
                const stepDuration = analysisSteps[i].duration;
                const progressIncrement = (100 / analysisSteps.length) / (stepDuration / 50);
                
                progressInterval = setInterval(() => {
                    setProgress(prev => {
                        const newProgress = prev + progressIncrement;
                        const maxProgress = ((i + 1) / analysisSteps.length) * 100;
                        return Math.min(newProgress, maxProgress);
                    });
                }, 50);

                await new Promise(resolve => {
                    stepTimeout = setTimeout(resolve, stepDuration);
                });

                clearInterval(progressInterval);
            }

            // 분석 완료 후 결과 페이지로 이동
            setTimeout(() => {
                navigate('/result', {
                    state: {
                        patientInfo,
                        uploadedFile,
                        imagePreview,
                        analysisResult: {
                            // 시뮬레이션된 AI 분석 결과
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
                        }
                    }
                });
            }, 500);
        };

        runAnalysis();

        return () => {
            clearTimeout(stepTimeout);
            clearInterval(progressInterval);
        };
    }, [navigate, patientInfo, uploadedFile, imagePreview]);

    if (!patientInfo || !uploadedFile) {
        return null; // 리다이렉트 중
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