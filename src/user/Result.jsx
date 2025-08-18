import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    User, 
    FileText, 
    Save,
    Send,
    Calendar,
    Activity,
    Eye,
    Brain,
    Mail,
    Layers
} from 'lucide-react';
import styles from './Result.module.css';

function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const [findings, setFindings] = useState('');
    const [impression, setImpression] = useState('');
    const [email, setEmail] = useState('');
    const [heatmapOpacity, setHeatmapOpacity] = useState(0.5);
    
    // 이전 페이지에서 전달받은 데이터
    const { patientInfo, uploadedFile, imagePreview, analysisResult } = location.state || {};

    useEffect(() => {
        // 데이터가 없으면 분석 페이지로 리다이렉트
        if (!patientInfo || !uploadedFile || !analysisResult) {
            navigate('/analysis');
            return;
        }

        // 초기 소견 텍스트 설정
        setFindings(`양측 폐야에서 폐렴 의심 소견이 관찰됩니다. 우측 폐하엽에서 침윤성 병변이 확인되며, 좌측 폐에서도 경미한 염증 반응이 보입니다.`);

        setImpression(`1. 폐렴 의심 (높은 확률: ${analysisResult.probability.pneumonia}%)
2. 추가 임상 평가 및 혈액 검사 권장
3. 항생제 치료 고려 필요`);
    }, [navigate, patientInfo, uploadedFile, analysisResult]);

    if (!patientInfo || !uploadedFile || !analysisResult) {
        return null; // 리다이렉트 중
    }

    const handleSaveDraft = () => {
        console.log('Draft saved');
        alert('임시 저장되었습니다.');
    };

    const handleSubmitReport = () => {
        if (!findings.trim() || !impression.trim()) {
            alert('소견과 판독 의견을 모두 입력해주세요.');
            return;
        }
        console.log('Report submitted');
        alert('보고서가 제출되었습니다.');
    };

    const handleSendEmail = () => {
        if (!email.trim()) {
            alert('이메일 주소를 입력해주세요.');
            return;
        }
        console.log('Email sent to:', email);
        alert(`${email}로 결과가 전송되었습니다.`);
    };

    const currentDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <div className={styles.container}>
            {/* greeting 공간 */}
            <div className={styles.greeting}>
                환자의 흉부 X-ray 진단 결과를 확인하세요.
            </div>

            {/* 메인 그리드 (50:50) */}
            <div className={styles.mainGrid}>
                {/* 왼쪽 50% */}
                <div className={styles.leftColumn}>
                    {/* 카드1: 환자 정보 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <User size={18} />
                                환자 정보
                            </h2>
                            <div className={styles.patientIdButton}>
                                ID: {patientInfo.patientId}
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.patientInfoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>이름</span>
                                    <span className={styles.infoValue}>{patientInfo.name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>성별</span>
                                    <span className={styles.infoValue}>{patientInfo.gender}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>생년월일</span>
                                    <span className={styles.infoValue}>{patientInfo.birthDate}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>혈액형</span>
                                    <span className={styles.infoValue}>{patientInfo.bloodType}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>검사 날짜</span>
                                    <span className={styles.infoValue}>{currentDate}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>검사 유형</span>
                                    <span className={styles.infoValue}>흉부 X-ray</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 카드2: 흉부 X-ray 사진과 AI 리포트 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <Eye size={18} />
                                흉부 X-ray 및 AI 분석
                            </h2>
                            <div className={styles.heatmapControls}>
                                <Layers size={16} />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={heatmapOpacity}
                                    onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                                    className={styles.opacitySlider}
                                />
                                <span className={styles.opacityValue}>{Math.round(heatmapOpacity * 100)}%</span>
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.imageSection}>
                                {imagePreview ? (
                                    <div className={styles.imageWrapper}>
                                        <img 
                                            src={imagePreview} 
                                            alt="흉부 X-ray"
                                            className={styles.xrayImage}
                                        />
                                        <div 
                                            className={styles.heatmapOverlay}
                                            style={{ opacity: heatmapOpacity }}
                                        >
                                            <div className={styles.heatmapFilter}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noImagePlaceholder}>
                                        <FileText size={48} color="#9ca3af" />
                                        <p>이미지를 표시할 수 없습니다</p>
                                    </div>
                                )}
                            </div>
                            <div className={styles.aiReportSection}>
                                <h3 className={styles.aiReportTitle}>
                                    <Brain size={14} />
                                    AI 분석 요약
                                </h3>
                                <p className={styles.aiReportText}>
                                    AI 분석 결과, 폐렴의 가능성이 높으며 우측 폐하엽에서 침윤성 병변이 확인되었습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 50% */}
                <div className={styles.rightColumn}>
                    {/* 카드3: 병변과 확률 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <Activity size={18} />
                                병변 진단 확률
                            </h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.probabilityList}>
                                <div className={styles.probabilityItem}>
                                    <div className={styles.probabilityHeader}>
                                        <div className={styles.conditionInfo}>
                                            <div className={styles.conditionDot} style={{backgroundColor: '#dc2626'}}></div>
                                            <span className={styles.conditionName}>폐렴</span>
                                        </div>
                                        <span className={styles.probabilityValue}>{analysisResult.probability.pneumonia}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div 
                                            className={styles.progressFill}
                                            style={{ 
                                                width: `${analysisResult.probability.pneumonia}%`,
                                                backgroundColor: '#dc2626'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.probabilityItem}>
                                    <div className={styles.probabilityHeader}>
                                        <div className={styles.conditionInfo}>
                                            <div className={styles.conditionDot} style={{backgroundColor: '#d97706'}}></div>
                                            <span className={styles.conditionName}>결핵</span>
                                        </div>
                                        <span className={styles.probabilityValue}>{analysisResult.probability.tuberculosis}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div 
                                            className={styles.progressFill}
                                            style={{ 
                                                width: `${analysisResult.probability.tuberculosis}%`,
                                                backgroundColor: '#d97706'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.probabilityItem}>
                                    <div className={styles.probabilityHeader}>
                                        <div className={styles.conditionInfo}>
                                            <div className={styles.conditionDot} style={{backgroundColor: '#6b7280'}}></div>
                                            <span className={styles.conditionName}>기타</span>
                                        </div>
                                        <span className={styles.probabilityValue}>{analysisResult.probability.other}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div 
                                            className={styles.progressFill}
                                            style={{ 
                                                width: `${analysisResult.probability.other}%`,
                                                backgroundColor: '#6b7280'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 카드4: 의사 소견 입력 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <FileText size={18} />
                                의사 소견
                            </h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.inputSection}>
                                <label className={styles.inputLabel}>소견</label>
                                <textarea
                                    className={styles.textarea}
                                    value={findings}
                                    onChange={(e) => setFindings(e.target.value)}
                                    placeholder="소견을 입력하세요..."
                                    rows={3}
                                />
                            </div>
                            <div className={styles.inputSection}>
                                <label className={styles.inputLabel}>판독 의견</label>
                                <textarea
                                    className={styles.textarea}
                                    value={impression}
                                    onChange={(e) => setImpression(e.target.value)}
                                    placeholder="판독 의견을 입력하세요..."
                                    rows={3}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button 
                                    onClick={handleSaveDraft}
                                    className={`${styles.button} ${styles.saveButton}`}
                                >
                                    <Save size={16} />
                                    임시 저장
                                </button>
                                <button 
                                    onClick={handleSubmitReport}
                                    className={`${styles.button} ${styles.submitButton}`}
                                >
                                    <FileText size={16} />
                                    보고서 제출
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 카드5: 이메일 발송 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <Mail size={18} />
                                검사 결과 발송
                            </h2>
                            <button 
                                onClick={handleSendEmail}
                                className={styles.sendButton}
                            >
                                <Send size={16} />
                                발송
                            </button>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.inputSection}>
                                <label className={styles.inputLabel}>환자 이메일 주소</label>
                                <input
                                    type="email"
                                    className={styles.emailInput}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="patient@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;