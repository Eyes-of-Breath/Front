import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    User, 
    FileText, 
    Save,
    Calendar,
    Activity,
    Eye,
    Brain,
    Layers,
    Image as ImageIcon,
    PenTool
} from 'lucide-react';
import styles from './Result.module.css';

function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const [findings, setFindings] = useState('');
    const [gradcamImage, setGradcamImage] = useState(null); // GradCAM 이미지 상태
    
    // 이전 페이지에서 전달받은 데이터
    const { patientInfo, uploadedFile, imagePreview, analysisResult } = location.state || {};

    useEffect(() => {
        // 데이터가 없으면 분석 페이지로 리다이렉트
        if (!patientInfo || !uploadedFile || !analysisResult) {
            navigate('/analysis');
            return;
        }

        // TODO: 백엔드에서 GradCAM 이미지 가져오기
        // fetchGradcamImage();
    }, [navigate, patientInfo, uploadedFile, analysisResult]);

    // GradCAM 이미지를 가져오는 함수 (백엔드 연동용)
    const fetchGradcamImage = async () => {
        try {
            // TODO: 실제 API 호출
            // const response = await fetch(`/api/v1/diagnosis/gradcam/${analysisResult.id}`);
            // const blob = await response.blob();
            // const imageUrl = URL.createObjectURL(blob);
            // setGradcamImage(imageUrl);
            
            console.log('GradCAM 이미지 가져오기 (백엔드 연동 필요)');
        } catch (error) {
            console.error('GradCAM 이미지 로드 실패:', error);
        }
    };

    if (!patientInfo || !uploadedFile || !analysisResult) {
        return null; // 리다이렉트 중
    }

    const handleSaveDraft = () => {
        console.log('Draft saved');
        alert('임시 저장되었습니다.');
    };

    const handleSubmitReport = () => {
        if (!findings.trim()) {
            alert('소견을 입력해주세요.');
            return;
        }
        console.log('Report submitted');
        alert('보고서가 제출되었습니다.');
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

                    {/* 카드2: 흉부 X-ray 사진 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <Eye size={18} />
                                흉부 X-ray 이미지
                            </h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.imageComparisonSection}>
                                {/* 원본 이미지 */}
                                <div className={styles.imageContainer}>
                                    <div className={styles.imageWrapper}>
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="흉부 X-ray 원본"
                                                className={styles.xrayImage}
                                            />
                                        ) : (
                                            <div className={styles.noImagePlaceholder}>
                                                <FileText size={32} color="#9ca3af" />
                                                <p>원본 이미지를 표시할 수 없습니다</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* GradCAM 분석 이미지 */}
                                <div className={styles.imageContainer}>
                                    <div className={styles.imageWrapper}>
                                        {gradcamImage ? (
                                            <img 
                                                src={gradcamImage} 
                                                alt="흉부 X-ray GradCAM"
                                                className={styles.xrayImage}
                                            />
                                        ) : (
                                            <div className={styles.gradcamPlaceholder}>
                                                <Brain size={32} color="#6bb6ff" />
                                                <p>AI가 주목한 부분을 나타냅니다</p>
                                                <span className={styles.placeholderSubtext}>
                                                    분석 중...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
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

                    {/* 카드4: AI 분석 리포트 */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <PenTool size={18} />
                                AI 분석 리포트
                            </h2>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.aiReportSection}>
                                <div className={styles.aiAnalysisContent}>
                                    <p className={styles.analysisText}>
                                        우측 폐하엽에서 침윤성 병변이 확인되었으며, 폐렴의 가능성이 높습니다. 
                                        좌측 폐에서도 경미한 염증 반응이 관찰됩니다. 추가 임상 평가 및 혈액 검사를 권장하며, 
                                        항생제 치료 고려가 필요합니다. 또한 경과 관찰을 위한 추적 검사도 필요할 것으로 판단됩니다.
                                    </p>
                                    
                                    <div className={styles.confidenceScore}>
                                        <span className={styles.confidenceLabel}>AI 정확도:</span>
                                        <span className={styles.confidenceValue}>94.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 카드5: 의사 소견 입력 */}
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
                </div>
            </div>
        </div>
    );
}

export default Result;