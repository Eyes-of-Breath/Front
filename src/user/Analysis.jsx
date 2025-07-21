import React, { useState } from 'react';
import { 
    User, 
    Upload, 
    Calendar, 
    Ruler, 
    Weight, 
    FileText, 
    BarChart3,
    Info
} from 'lucide-react';

// CSS 모듈 스타일을 인라인으로 변환
const styles = {
    container: {
        height: '100vh',
        padding: '1rem',
        backgroundImage: 'url("../assets/blue_gradient_background.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif"
    },
    wrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    greeting: {
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#1a1a1a',
        margin: '1rem 0 1.5rem 0',
        lineHeight: '1.6',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        flexShrink: 0,
        paddingLeft: '1.5rem'
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        flex: 1,
        minHeight: 0
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '1.5rem',
        border: '1px solid #e5e7eb',
        transition: 'box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: '1rem',
        flexShrink: 0
    },
    iconCircle: {
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
    },
    iconGreen: {
        backgroundColor: '#d1fae5'
    },
    iconBlue: {
        backgroundColor: '#dbeafe'
    },
    cardTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '0.5rem'
    },
    cardDescription: {
        color: '#6b7280'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        flex: 1
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputLabel: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
    },
    inputRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem'
    },
    inputRowThree: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.75rem'
    },
    inputWithIcon: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '0.75rem',
        color: '#9ca3af',
        zIndex: 1
    },
    inputWithPadding: {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 2.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#059669',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: 'auto'
    },
    uploadArea: {
        border: '2px dashed #d1d5db',
        borderRadius: '0.5rem',
        padding: '2rem',
        textAlign: 'center',
        transition: 'border-color 0.2s ease',
        marginBottom: '1rem',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileInput: {
        display: 'none'
    },
    uploadLabel: {
        cursor: 'pointer',
        display: 'block'
    },
    uploadIcon: {
        fontSize: '3rem',
        display: 'block',
        marginBottom: '1rem'
    },
    uploadTitle: {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    },
    uploadSubtitle: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1rem'
    },
    uploadButton: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        display: 'inline-block',
        transition: 'background-color 0.2s ease'
    },
    fileInfo: {
        fontSize: '0.875rem',
        color: '#6b7280',
        flexShrink: 0
    }
};

function PatientUploadInterface() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [patientInfo, setPatientInfo] = useState({
        name: '',
        patientId: '',
        birthDate: '',
        gender: '',
        bloodType: '',
        height: '',
        weight: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('업로드된 파일:', file);
            // DICOM 파일 처리 로직
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1 style={styles.greeting}>
                    환자의 흉부 X-ray 파일을 업로드하고 vit을 이용해 판독 결과를 확인하세요.
                </h1>
                
                <div style={styles.cardGrid}>
                    {/* 환자 정보 직접 입력 카드 (왼쪽) */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={{...styles.iconCircle, ...styles.iconGreen}}>
                                <User size={32} color="#059669" />
                            </div>
                            <h2 style={styles.cardTitle}>
                                환자 정보 입력
                            </h2>
                            <p style={styles.cardDescription}>
                                환자 정보를 직접 입력하고 새로운 검사를 시작하세요
                            </p>
                        </div>
                        
                        <div style={styles.formContainer}>
                            <div style={styles.inputGroup}>
                                <div style={styles.inputLabel}>
                                    환자 이름
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={patientInfo.name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="환자 이름을 입력하세요"
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <div style={styles.inputLabel}>
                                    환자 ID
                                </div>
                                <input
                                    type="text"
                                    name="patientId"
                                    value={patientInfo.patientId}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="P-20250504"
                                />
                            </div>
                            
                            <div style={styles.inputRow}>
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputLabel}>
                                        생년월일
                                    </div>
                                    <div style={styles.inputWithIcon}>
                                        <Calendar size={16} style={styles.inputIcon} />
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={patientInfo.birthDate}
                                            onChange={handleInputChange}
                                            style={styles.inputWithPadding}
                                        />
                                    </div>
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputLabel}>
                                        성별
                                    </div>
                                    <select
                                        name="gender"
                                        value={patientInfo.gender}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    >
                                        <option value="">선택</option>
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div style={styles.inputRowThree}>
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputLabel}>
                                        혈액형
                                    </div>
                                    <select
                                        name="bloodType"
                                        value={patientInfo.bloodType}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    >
                                        <option value="">선택</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputLabel}>
                                        키 (cm)
                                    </div>
                                    <div style={styles.inputWithIcon}>
                                        <Ruler size={16} style={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="height"
                                            value={patientInfo.height}
                                            onChange={handleInputChange}
                                            style={styles.inputWithPadding}
                                            placeholder="165"
                                        />
                                    </div>
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <div style={styles.inputLabel}>
                                        몸무게 (kg)
                                    </div>
                                    <div style={styles.inputWithIcon}>
                                        <Weight size={16} style={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="weight"
                                            value={patientInfo.weight}
                                            onChange={handleInputChange}
                                            style={styles.inputWithPadding}
                                            placeholder="55"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => console.log('분석 시작:', patientInfo)}
                                style={styles.submitButton}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                            >
                                <BarChart3 size={20} />
                                분석 시작
                            </button>
                        </div>
                    </div>

                    {/* DICOM 파일 업로드 카드 (오른쪽) */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={{...styles.iconCircle, ...styles.iconBlue}}>
                                <Upload size={32} color="#2563eb" />
                            </div>
                            <h2 style={styles.cardTitle}>
                                DICOM 파일 업로드
                            </h2>
                            <p style={styles.cardDescription}>
                                기존 의료 영상 파일을 업로드하여 분석하세요
                            </p>
                        </div>
                        
                        <div style={styles.uploadArea}>
                            <input
                                type="file"
                                accept=".dcm,.dicom"
                                onChange={handleFileUpload}
                                style={styles.fileInput}
                                id="dicom-upload"
                            />
                            <label
                                htmlFor="dicom-upload"
                                style={styles.uploadLabel}
                            >
                                <div style={styles.uploadIcon}>
                                    <FileText size={48} color="#6b7280" />
                                </div>
                                <p style={styles.uploadTitle}>
                                    파일을 드래그하여 업로드
                                </p>
                                <p style={styles.uploadSubtitle}>
                                    또는 클릭하여 파일 선택
                                </p>
                                <div style={styles.uploadButton}>
                                    파일 선택
                                </div>
                            </label>
                        </div>
                        
                        <div style={styles.fileInfo}>
                            <p style={{margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <Info size={14} /> 지원 형식: DICOM, DCM
                            </p>
                            <p style={{margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <Info size={14} /> 최대 파일 크기: 50MB
                            </p>
                            <p style={{margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <Info size={14} /> 흉부 엑스레이 이미지 권장
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientUploadInterface;