// Result.jsx (최종 수정본)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, FileText, Save, Activity, Eye, Layers, PenTool } from 'lucide-react';
import styles from './Result.module.css';

function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. 데이터 수신 방식을 patient 객체로 변경
    const { patient } = location.state || {};

    // 2. patient 객체로부터 필요한 데이터 추출
    const xrayImage = patient?.xrayImages?.[0];
    const diagnosisResult = xrayImage?.diagnosisResult;
    const resultId = patient?.xrayImages?.[0]?.diagnosisResult?.resultId;

    const [findings, setFindings] = useState('');
    const [impression, setImpression] = useState('');
    const [heatmapOpacity, setHeatmapOpacity] = useState(0.5);
    
    useEffect(() => {
        if (!patient || !xrayImage || !diagnosisResult) {
            alert("잘못된 접근입니다. 분석 페이지로 이동합니다.");
            navigate('/analysis');
            return;
        }
        // 소견/판독 입력란은 처음에 빈 값으로 둡니다.
    }, [navigate, patient, xrayImage, diagnosisResult]);

    if (!patient || !xrayImage || !diagnosisResult) return null;
    
    const handleSaveDraft = () => alert('임시 저장되었습니다.');
    const handleSubmitReport = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/diagnosis/${resultId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: findings
                    }),
                }
            );

            if (response.ok) {
                alert("보고서가 성공적으로 제출되었습니다.");
            } else {
                const errorData = await response.json();
                console.error("보고서 제출 실패:", errorData);
                alert("보고서 제출에 실패했습니다.");
            }
        } catch (error) {
            console.error("보고서 제출 중 오류:", error);
            alert("보고서 제출 중 오류가 발생했습니다.");
        }
    };
    
    const analysisDate = new Date(diagnosisResult.createdAt).toLocaleDateString('ko-KR');

    // AI 분석 요약 텍스트 생성 (한 문장으로 연결)
    const generateAiSummary = () => {
        let summaryText = `AI 분석 결과, ${diagnosisResult.top1Disease} 가능성이 ${(diagnosisResult.top1Probability * 100).toFixed(1)}%로 가장 높게 예측되었습니다.`;
        
        if (diagnosisResult.top2Disease) {
            summaryText += ` 다음으로 ${diagnosisResult.top2Disease} 가능성이 ${(diagnosisResult.top2Probability * 100).toFixed(1)}%로 예측됩니다.`;
        }
        
        summaryText += ` 추가적인 임상 검사 및 전문의 상담을 통해 정확한 진단을 확정하시기 바랍니다.`;
        
        return summaryText;
    };

    // 4. JSX 전체를 실제 데이터에 연결
    return (
        <div className={styles.container}>
            <div className={styles.greeting}>{patient.name}님의 흉부 X-ray 진단 결과를 확인하세요.</div>
            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><User size={18} /> 환자 정보</h2>
                            <div className={styles.patientIdButton}>{patient.patientCode}</div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.patientInfoGrid}>
                                <InfoItem label="이름" value={patient.name} />
                                <InfoItem label="성별" value={patient.gender === 'M' ? '남성' : '여성'} />
                                <InfoItem label="생년월일" value={patient.birthDate} />
                                <InfoItem label="혈액형" value={patient.bloodType || 'N/A'} />
                                <InfoItem label="검사 날짜" value={analysisDate} />
                                <InfoItem label="검사 유형" value="흉부 X-ray" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><Eye size={18} /> 흉부 X-ray 및 AI 분석</h2>
                            <div className={styles.heatmapControls}>
                                <Layers size={16} />
                                <input type="range" min="0" max="1" step="0.1" value={heatmapOpacity} onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))} className={styles.opacitySlider}/>
                                <span className={styles.opacityValue}>{Math.round(heatmapOpacity * 100)}%</span>
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.imageSection}>
                                <div className={styles.imageWrapper}>
                                    <img src={xrayImage.imageUrl} alt="흉부 X-ray" className={styles.xrayImage} />
                                    <img 
                                        src={diagnosisResult.gradcamImagePath} 
                                        alt="Grad-CAM Heatmap" 
                                        className={styles.heatmapOverlay} 
                                        style={{ opacity: heatmapOpacity }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><Activity size={18} /> 병변 진단 확률 (Top 3)</h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.probabilityList}>
                                {diagnosisResult.top1Disease && <ProbabilityItem name={diagnosisResult.top1Disease} value={(diagnosisResult.top1Probability * 100).toFixed(1)} color="#bbc9f7" />}
                                {diagnosisResult.top2Disease && <ProbabilityItem name={diagnosisResult.top2Disease} value={(diagnosisResult.top2Probability * 100).toFixed(1)} color="#a3d5f7" />}
                                {diagnosisResult.top3Disease && <ProbabilityItem name={diagnosisResult.top3Disease} value={(diagnosisResult.top3Probability * 100).toFixed(1)} color="#f7e99c" />}
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <FileText size={18} />
                                의사 소견
                            </h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.inputSection}>
                                <label className={styles.inputLabel} htmlFor="findings-textarea">소견</label>
                                <textarea
                                    id="findings-textarea"
                                    className={styles.textarea}
                                    value={findings}
                                    onChange={(e) => setFindings(e.target.value)}
                                    placeholder="소견을 입력하세요..."
                                    rows={4}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button 
                                    onClick={handleSaveDraft}
                                    className={`${styles.button} ${styles.saveButton}`}
                                    type="button"
                                >
                                    <Save size={16} />
                                    임시 저장
                                </button>
                                <button 
                                    onClick={handleSubmitReport}
                                    className={`${styles.button} ${styles.submitButton}`}
                                    type="button"
                                >
                                    <FileText size={16} />
                                    보고서 제출
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                         <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><PenTool size={18} /> AI 분석 요약</h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.aiSummaryContent}>
                                <div className={styles.summarySection}>
                                    <p className={styles.summaryText}>
                                        {generateAiSummary()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const InfoItem = ({ label, value }) => <div className={styles.infoItem}><span className={styles.infoLabel}>{label}</span><span className={styles.infoValue}>{value}</span></div>;
const ProbabilityItem = ({ name, value, color }) => (
    <div className={styles.probabilityItem}>
        <div className={styles.probabilityHeader}>
            <div className={styles.conditionInfo}>
                <div className={styles.conditionDot} style={{backgroundColor: color}}></div>
                <span className={styles.conditionName}>{name}</span>
            </div>
            <span className={styles.probabilityValue}>{value}%</span>
        </div>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${value}%`, backgroundColor: color }} /></div>
    </div>
);

export default Result;