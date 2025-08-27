import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    Upload, 
    Calendar, 
    Ruler, 
    Weight, 
    FileText, 
    BarChart3,
    Info,
    X,
    Check
} from 'lucide-react';
import styles from './Analysis.module.css';

function PatientUploadInterface() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [patientInfo, setPatientInfo] = useState({
        name: '',
        patientCode: '',
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

    // DICOM 메타데이터에서 환자 정보 추출 (시뮬레이션)
    const extractPatientInfoFromDICOM = (file) => {
        // 실제로는 DICOM 파서 라이브러리 사용
        // 여기서는 시뮬레이션으로 랜덤 데이터 생성
        const sampleData = {
            name: '김환자',
            patientCode: `P-${Date.now().toString().slice(-6)}`,
            birthDate: '1980-05-15',
            gender: '남성',
            bloodType: 'A+',
            height: '175',
            weight: '70'
        };
        
        return sampleData;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('업로드된 파일:', file);
            console.log('파일 타입:', file.type);
            console.log('파일 이름:', file.name);
            
            // 파일 정보 저장
            setUploadedFile(file);
            
            // 이미지 미리보기 생성 (일반 이미지 파일만)
            if (file.type.startsWith('image/')) {
                console.log('이미지 파일로 인식');
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                console.log('DICOM 또는 기타 파일로 인식');
                // DICOM 파일이나 기타 파일은 미리보기 없음
                setImagePreview(null);
            }
            
            // DICOM 파일인 경우 환자 정보 자동 추출
            if (file.name.toLowerCase().includes('.dcm') || file.name.toLowerCase().includes('.dicom')) {
                console.log('DICOM 파일 처리 시작');
                try {
                    const extractedInfo = extractPatientInfoFromDICOM(file);
                    setPatientInfo(extractedInfo);
                    console.log('환자 정보 추출 완료:', extractedInfo);
                } catch (error) {
                    console.error('DICOM 파일 처리 중 오류:', error);
                    alert('DICOM 파일에서 환자 정보를 추출할 수 없습니다.');
                }
            }
        }
    };

    const handleAnalysis = async () => {
        const requiredFields = {
            name: "이름을 입력해주세요.",
            patientCode: "환자 Code를 입력해주세요.",
            birthDate: "생년월일을 입력해주세요.",
            gender: "성별을 선택해주세요.",
            bloodType: "혈액형을 선택해주세요.",
            height: "키를 입력해주세요.",
            weight: "몸무게를 입력해주세요."
        };

        for (const [key, message] of Object.entries(requiredFields)) {
            if (!patientInfo[key]) {
                alert(message);
                return;
            }
        }

        if (!uploadedFile) {
            alert('파일을 업로드해주세요.');
            return;
        }

        // 로딩 페이지로 이동하면서 데이터 전달
        navigate('/loading', {
            state: {
                patientInfo,
                uploadedFile,
                imagePreview
            }
        });
    };

    const removeUploadedFile = () => {
        setUploadedFile(null);
        setImagePreview(null);
        // 파일 입력 초기화
        const fileInput = document.getElementById('dicom-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.greeting}>
                    환자의 흉부 X-ray 파일을 업로드하고 AI를 이용해 판독 결과를 확인하세요.
                </h1>
                
                <div className={styles.cardGrid}>
                    {/* 환자 정보 직접 입력 카드 (왼쪽) */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconCircle} ${styles.iconBlue}`}>
                                <User size={32} color="white" />
                            </div>
                            <h2 className={styles.cardTitle}>
                                환자 정보 입력
                            </h2>
                            <p className={styles.cardDescription}>
                                환자 정보를 직접 입력하고 새로운 검사를 시작하세요
                            </p>
                        </div>
                        
                        <div className={styles.formContainer}>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputLabel}>
                                    환자 이름
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={patientInfo.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="환자 이름을 입력하세요"
                                />
                            </div>
                            
                            <div className={styles.inputGroup}>
                                <div className={styles.inputLabel}>
                                    환자 Code
                                </div>
                                <input
                                    type="text"
                                    name="patientCode"
                                    value={patientInfo.patientCode}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="P-20250504"
                                />
                            </div>
                            
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputLabel}>
                                        생년월일
                                    </div>
                                    <div className={styles.inputWithIcon}>
                                        <Calendar size={16} className={styles.inputIcon} />
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={patientInfo.birthDate}
                                            onChange={handleInputChange}
                                            className={styles.inputWithPadding}
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputLabel}>
                                        성별
                                    </div>
                                    <select
                                        name="gender"
                                        value={patientInfo.gender}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    >
                                        <option value="">선택</option>
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.inputRowThree}>
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputLabel}>
                                        혈액형
                                    </div>
                                    <select
                                        name="bloodType"
                                        value={patientInfo.bloodType}
                                        onChange={handleInputChange}
                                        className={styles.input}
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
                                
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputLabel}>
                                        키 (cm)
                                    </div>
                                    <div className={styles.inputWithIcon}>
                                        <Ruler size={16} className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="height"
                                            value={patientInfo.height}
                                            onChange={handleInputChange}
                                            className={styles.inputWithPadding}
                                            placeholder="165"
                                        />
                                    </div>
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputLabel}>
                                        몸무게 (kg)
                                    </div>
                                    <div className={styles.inputWithIcon}>
                                        <Weight size={16} className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="weight"
                                            value={patientInfo.weight}
                                            onChange={handleInputChange}
                                            className={styles.inputWithPadding}
                                            placeholder="55"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleAnalysis}
                                disabled={isAnalyzing}
                                className={`${styles.submitButton} ${isAnalyzing ? styles.analyzing : ''}`}
                            >
                                <BarChart3 size={20} />
                                {isAnalyzing ? '분석 중...' : '분석 시작'}
                            </button>
                        </div>
                    </div>

                    {/* DICOM 파일 업로드 카드 (오른쪽) */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconCircle} ${styles.iconBlue}`}>
                                <Upload size={32} color="white" />
                            </div>
                            <h2 className={styles.cardTitle}>
                                흉부 X-ray 업로드
                            </h2>
                            <p className={styles.cardDescription}>
                                기존 의료 영상 파일을 업로드하여 분석하세요
                            </p>
                        </div>
                        
                        {/* 업로드된 파일 미리보기 */}
                        {uploadedFile && (
                            <div>
                                <div className={styles.uploadedFilePreview}>
                                    <div className={styles.previewHeader}>
                                        <h4>업로드된 파일</h4>
                                        <button 
                                            onClick={removeUploadedFile}
                                            className={styles.removeButton}
                                            aria-label="파일 제거"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    
                                    {imagePreview ? (
                                        <div 
                                            className={styles.imagePreviewContainer}
                                            style={{backgroundImage: `url(${imagePreview})`}}
                                        />
                                    ) : (
                                        <div className={styles.previewPlaceholder}>
                                            <FileText size={48} color="#9ca3af" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* 파일 정보를 미리보기 밑으로 이동 */}
                                <div className={styles.fileDetails}>
                                    <p><strong>파일명:</strong> {uploadedFile.name}</p>
                                    <p><strong>크기:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <p><strong>타입:</strong> {uploadedFile.type || 'DICOM'}</p>
                                    <div className={styles.statusIndicator}>
                                        <Check size={16} color="#6bb6ff" />
                                        <span>업로드 완료</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* 업로드 영역 - 파일이 없을 때만 표시 */}
                        {!uploadedFile && (
                            <div className={styles.uploadArea}>
                                <input
                                    type="file"
                                    accept=".dcm,.dicom,image/*,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    className={styles.fileInput}
                                    id="dicom-upload"
                                />
                                <label
                                    htmlFor="dicom-upload"
                                    className={styles.uploadLabel}
                                >
                                    <div className={styles.uploadIcon}>
                                        <FileText size={48} color="#6b7280" />
                                    </div>
                                    <p className={styles.uploadTitle}>
                                        파일을 드래그하여 업로드
                                    </p>
                                    <p className={styles.uploadSubtitle}>
                                        또는 클릭하여 파일 선택
                                    </p>
                                    <div className={styles.uploadButton}>
                                        파일 선택
                                    </div>
                                </label>
                            </div>
                        )}
                        
                        <div className={styles.fileInfo}>
                            <p>
                                <Info size={14} /> 지원 형식: DICOM, DCM, JPG, PNG
                            </p>
                            <p>
                                <Info size={14} /> 최대 파일 크기: 50MB
                            </p>
                            <p>
                                <Info size={14} /> 흉부 X-ray 이미지 권장
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientUploadInterface;