import React, { useState } from 'react';
import styles from './Patient.module.css';
import { Search, FileText, Trash2 } from 'lucide-react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Patient = () => {
  const [searchCriteria, setSearchCriteria] = useState({ name: '', birthDate: '', gender: '' });
  const [searchID, setSearchID] = useState({ patientID: '' });
  const [searchCode, setSearchCode] = useState({ patientCode: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchIDLoading, setIsSearchIDLoading] = useState(false);
  const [isSearchCodeLoading, setIsSearchCodeLoading] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const memberId = Number(localStorage.getItem('memberId'));

  // ======== 검색 함수들 ========
  const handleSearch = async () => {
    setIsSearchLoading(true);
    setSelectedPatient(null);
    try {
      const response = await fetch(
        `${SERVER_URL}/patients/search?name=${encodeURIComponent(searchCriteria.name)}&birthDate=${encodeURIComponent(searchCriteria.birthDate)}&gender=${encodeURIComponent(searchCriteria.gender)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (!response.ok || !data || data.length === 0) {
        alert('해당 조건에 맞는 환자를 찾을 수 없습니다.');
        return;
      }
      console.log(data);

      const exactMatch = data.find(patient => patient.name === searchCriteria.name);
      setSelectedPatient(exactMatch || null);
    } catch (err) {
      console.error('환자 검색 중 오류:', err);
      alert('모든 정보를 입력해주세요.');
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSearchID = async () => {
    setIsSearchIDLoading(true);
    setSelectedPatient(null);
    try {
      const response = await fetch(`${SERVER_URL}/patients/${encodeURIComponent(searchID.patientID)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data) {
        alert('환자가 존재하지 않습니다.');
        return;
      }
      setSelectedPatient(data);
    } catch (err) {
      console.error('환자 검색 중 오류:', err);
      alert('환자가 존재하지 않습니다.');
    } finally {
      setIsSearchIDLoading(false);
    }
  };

  const handleSearchCode = async () => {
    setIsSearchCodeLoading(true);
    setSelectedPatient(null);
    try {
      const response = await fetch(`${SERVER_URL}/patients/code/${encodeURIComponent(searchCode.patientCode)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok || !data) {
        alert('환자가 존재하지 않습니다.');
        return;
      }
      setSelectedPatient(data);
    } catch (err) {
      console.error('환자 검색 중 오류:', err);
      alert('환자가 존재하지 않습니다.');
    } finally {
      setIsSearchCodeLoading(false);
    }
  };

  const handleDeleteReport = async (resultId) => {
    try {
      const response = await fetch(`${SERVER_URL}/diagnosis/${resultId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.ok) {
        alert("보고서가 삭제되었습니다.");
        setSelectedPatient(prev => ({
          ...prev,
          xrayImages: prev.xrayImages.filter(x => x.diagnosisResult?.resultId !== resultId)
        }));
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 심각도 분류 함수
  const getSeverityInfo = (probability) => {
    if (probability >= 0.9) return { 
      level: 'high', 
      text: '높음', 
      class: 'severityHigh' 
    };
    if (probability >= 0.8) return { 
      level: 'moderate', 
      text: '보통', 
      class: 'severityModerate' 
    };
    return { 
      level: 'normal', 
      text: '낮음', 
      class: 'severityNormal' 
    };
  };

  const getStatusClass = (probability) => {
    if (probability >= 0.9) return 'statusHigh';
    if (probability >= 0.8) return 'statusModerate';
    return 'statusNormal';
  };

  return (
    <div className={styles.patientContainer}>
      <main className={styles.mainContent}>
        <div style={{ fontSize: '1.5rem', fontWeight: '300', color: '#1a1a1a', paddingTop: '2rem', lineHeight: '1.6', textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)', paddingLeft: '0.5rem', textAlign: 'left', marginBottom: '1rem', flex: 1 }}>
          빠른 검색으로 필요한 정보를 바로 찾아보세요 🔍
        </div>

        <div className={styles.mainLayout}>
          {/* 왼쪽 검색 섹션 */}
          <div className={styles.leftSection}>
            {/* 이름/생년월일/성별 검색 */}
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}><Search size={16} style={{ marginRight: '8px' }} />환자 검색</h2>
              <div className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>환자명:</label>
                  <input type="text" value={searchCriteria.name} onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })} placeholder="이름을 입력하세요" className={styles.inputID} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>생년월일:</label>
                  <input type="text" value={searchCriteria.birthDate} onChange={(e) => setSearchCriteria({ ...searchCriteria, birthDate: e.target.value })} placeholder="YYYY-MM-DD" className={styles.inputID} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>성별:</label>
                  <select value={searchCriteria.gender} onChange={(e) => setSearchCriteria({ ...searchCriteria, gender: e.target.value })} className={styles.inputID}>
                    <option value="">선택하세요</option>
                    <option value="M">남</option>
                    <option value="F">여</option>
                  </select>
                </div>
                <div className={styles.buttonGroup}>
                  <button onClick={handleSearch} disabled={isSearchLoading} className={styles.button}>
                    {isSearchLoading ? '검색 중...' : '검색'}
                  </button>
                </div>
              </div>
            </div>

            {/* ID 검색 */}
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}><Search size={16} style={{ marginRight: '8px' }} />환자 ID로 검색</h2>
              <div className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <input type="text" value={searchID.patientID} onChange={(e) => setSearchID({ ...searchID, patientID: e.target.value })} placeholder="Patient ID를 입력하세요" className={styles.inputID} />
                </div>
                <div className={styles.buttonGroup}>
                  <button onClick={handleSearchID} disabled={isSearchIDLoading} className={styles.button}>
                    {isSearchIDLoading ? '검색 중...' : '검색'}
                  </button>
                </div>
              </div>
            </div>

            {/* Code 검색 */}
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}><Search size={16} style={{ marginRight: '8px' }} />환자 Code로 검색</h2>
              <div className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <input type="text" value={searchCode.patientCode} onChange={(e) => setSearchCode({ ...searchCode, patientCode: e.target.value })} placeholder="Patient Code를 입력하세요" className={styles.inputID} />
                </div>
                <div className={styles.buttonGroup}>
                  <button onClick={handleSearchCode} disabled={isSearchCodeLoading} className={styles.button}>
                    {isSearchCodeLoading ? '검색 중...' : '검색'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 검색 결과 */}
          <div className={styles.rightSection}>
            {selectedPatient ? (
              <div className={styles.patientSection}>
                <div className={styles.patientCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.patientName}>{selectedPatient.name}</h3>
                      <p className={styles.patientId}>환자 코드: {selectedPatient.patientCode}</p>
                      <p className={styles.patientId}>환자 ID: {selectedPatient.patientId}</p>
                    </div>
                    <div className={styles.patientDetails}>
                      <p>생년월일: {selectedPatient.birthDate}</p>
                      <p>성별: {selectedPatient.gender}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.xraySection}>
                  <h4 className={styles.sectionTitle}><FileText size={16} style={{ marginRight: '8px' }} />흉부 엑스레이 기록</h4>

                  <div className={styles.recordsContainer}>
                    {selectedPatient.xrayImages?.length > 0 ? (
                      selectedPatient.xrayImages.map((xray) => {
                        const diagnosis = xray.diagnosisResult;
                        if (!diagnosis) return null;

                        const probability = diagnosis.probability;
                        const severityInfo = getSeverityInfo(probability);
                        let severityEmoji = '';
                        if (severityInfo.level === 'high') severityEmoji = '🚨';
                        else if (severityInfo.level === 'moderate') severityEmoji = '🔬';
                        else severityEmoji = '✅';

                        return (
                          <div key={xray.imageId} className={styles.recordCard}>
                            <div className={styles.recordLayout}>
                              <div className={styles.recordInfo}>
                                <div className={styles.recordHeader}>
                                  <div className={`${styles.severityIndicator} ${styles[severityInfo.class]}`}>
                                    <span>{severityEmoji} 위험도: {severityInfo.text}</span>
                                  </div>
                                  <p className={styles.recordDate}>{xray.uploadedAt.split('T')[0]}</p>
                                  {Number(selectedPatient.memberId) === memberId && (
                                    <Trash2 
                                      size={18} 
                                      className={styles.deleteIcon} 
                                      onClick={() => {
                                        const confirmed = window.confirm("정말 삭제하시겠습니까?");
                                        if (confirmed) handleDeleteReport(diagnosis.resultId);
                                      }}
                                    />
                                  )}
                                </div>

                                {/* <div className={styles.diagnosisSection}>
                                  <div className={styles.diagnosisTitle}>
                                    🔬 AI 진단 결과
                                  </div>
                                  <div className={styles.confidenceScore}>
                                    {Math.round(probability * 100)}%
                                  </div>
                                  <div className={styles.confidenceLabel}>
                                    신뢰도
                                  </div>
                                </div> */}

                                {diagnosis.comments && diagnosis.comments.length > 0 && (
                                  <div className={styles.commentSection}>
                                    {diagnosis.comments.map((comment) => (
                                      <div key={comment.commentId} className={styles.commentItem}>
                                        <p className={styles.doctorName}>{comment.doctorName || '의료진'} 소견</p>
                                        <p className={styles.commentText}>
                                          {comment.content}
                                          <br />
                                          <small style={{ color: '#94a3b8', fontSize: '12px' }}>
                                            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                                          </small>
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className={styles.imageGroup}>
                                <div>
                                  <div className={styles.imageLabel}>원본 X-Ray</div>
                                  <img src={diagnosis.imageUrl} alt={xray.fileName} className={styles.previewImage} />
                                </div>
                                <div>
                                  <div className={styles.imageLabel}>AI 분석 결과</div>
                                  <img src={diagnosis.gradcamImagePath} alt="Grad-CAM" className={styles.previewImage} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>엑스레이 기록이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              (!isSearchLoading && !isSearchIDLoading && !isSearchCodeLoading) && (
                <div className={styles.emptyState}>
                  <p>환자를 검색하면 엑스레이 기록이 여기에 표시됩니다.</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patient;