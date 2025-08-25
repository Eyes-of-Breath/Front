import React, { useState } from 'react';
import styles from './Patient.module.css';
import { Search, FileText, Download } from 'lucide-react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const accessToken = localStorage.getItem('accessToken');

const Patient = () => {
  const [searchCriteria, setSearchCriteria] = useState({ name: '', birthDate: '', gender: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchCriteria.name && !searchCriteria.birthDate && !searchCriteria.gender) {
      alert('최소 하나의 검색 조건을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setSelectedPatient(null);

    try {
      const response = await fetch(
        `${SERVER_URL}/patients/search?name=${encodeURIComponent(searchCriteria.name)}&birthDate=${encodeURIComponent(searchCriteria.birthDate)}&gender=${encodeURIComponent(searchCriteria.gender)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data || data.length === 0) {
        alert('해당 조건에 맞는 환자를 찾을 수 없습니다.');
        setSelectedPatient(null);
        return;
      }

      const exactMatch = data.find(
        patient => patient.name === searchCriteria.name
      );

      setSelectedPatient(exactMatch || null);

    } catch (err) {
      console.error('환자 검색 중 오류:', err);
      alert('모든 정보를 입력해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchCriteria({ name: '', birthDate: '', gender: '' });
    setSelectedPatient(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priorityHigh';
      case 'moderate': return 'priorityModerate';
      default: return 'priorityNormal';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '⚠️';
      case 'moderate': return '📊';
      default: return '✅';
    }
  };

  return (
    <div className={styles.patientContainer}>
      <main className={styles.mainContent}>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#1a1a1a',
            margin: '0 0 1rem 0',
            paddingTop: '2rem',
            lineHeight: '1.6',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            paddingLeft: '0.5rem',
            textAlign: 'left'
          }}
        >
          여기서 환자 정보를 관리하세요.
        </div>

        <div
          className={styles.mainLayout}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            gap: '2rem',
            height: '100vh',
            overflow: 'hidden',
            alignItems: 'start'
          }}
        >
          {/* 왼쪽: 검색 섹션 */}
          <div className={styles.leftSection}>
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}>
                <Search size={16} style={{ marginRight: '8px' }} />
                환자 검색
              </h2>

              <div className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>환자명:</label>
                  <input
                    type="text"
                    value={searchCriteria.name}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                    className={styles.inputID}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.patientID}>생년월일:</label>
                  <input
                    type="text"
                    value={searchCriteria.birthDate}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, birthDate: e.target.value })}
                    placeholder="YYYY-MM-DD"
                    className={styles.inputID}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.patientID}>성별:</label>
                  <select
                    value={searchCriteria.gender}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, gender: e.target.value })}
                    className={styles.inputID}
                  >
                    <option value="">선택하세요</option>
                    <option value="M">남</option>
                    <option value="F">여</option>
                  </select>
                </div>

                <div className={styles.buttonGroup}>
                  <button onClick={handleSearch} disabled={isLoading} className={styles.button}>
                    {isLoading ? '검색 중...' : '검색'}
                  </button>
                  <button onClick={handleReset} className={styles.resetButton}>
                    초기화
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
                  <h4 className={styles.sectionTitle}>
                    <FileText size={16} style={{ marginRight: '8px' }} />
                    흉부 엑스레이 기록
                  </h4>

                  <div className={styles.recordsContainer}>
                    {selectedPatient.xrayImages && selectedPatient.xrayImages.length > 0 ? (
                      selectedPatient.xrayImages.map((xray) => (
                        <div key={xray.id} className={styles.recordCard}>
                          <div className={styles.recordLayout}>
                            <div className={styles.recordInfo}>
                              <div className={styles.recordHeader}>
                                <span className={`${styles.badge} ${styles[getPriorityClass(xray.priority)]}`}>
                                  {getPriorityIcon(xray.priority)} {xray.aiDiagnosis}
                                </span>
                                <span className={styles.recordDate}>{xray.date}</span>
                                <span className={styles.recordConfidence}>예측 정확도: {xray.confidence}%</span>
                              </div>
                            </div>

                            <div className={styles.imagePreview}>
                              <div className={styles.previewContainer}>
                                <div className={styles.previewPlaceholder}>
                                  <div>엑스레이 이미지</div>
                                  <div className={styles.imageId}>({xray.id})</div>
                                </div>
                                <button className={styles.saveButton} title="이미지 저장">
                                  <Download size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>엑스레이 기록이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : !isLoading ? (
              <div className={styles.emptyState}>
                <p>환자를 검색하면 엑스레이 기록이 여기에 표시됩니다.</p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patient;
