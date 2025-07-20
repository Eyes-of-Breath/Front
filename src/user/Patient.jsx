import React, { useState } from 'react';
import styles from './Patient.module.css'; // CSS Module import
import { Search, Calendar, FileText, Download } from 'lucide-react';

const Patient = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    birthDate: '',
    gender: ''
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 환자 데이터 (엑스레이 기록 포함)
  const mockPatients = [
    {
      id: 'P001',
      name: '김철수',
      birthDate: '1979-03-15',
      gender: '남',
      phone: '010-1234-5678',
      address: '서울시 강남구',
      xrayHistory: [
        {
          id: 'X001',
          date: '2024-01-15',
          type: 'PA View',
          aiDiagnosis: '정상',
          confidence: 92.5,
          findings: ['폐야 깨끗', '심장 크기 정상', '늑막강 정상'],
          radiologist: '박영수 전문의',
          priority: 'normal'
        },
        {
          id: 'X002',
          date: '2024-03-20',
          type: 'PA View',
          aiDiagnosis: '경미한 폐렴 의심',
          confidence: 78.3,
          findings: ['우하엽 음영 증가', '기관지 벽 비후', '심장 크기 정상'],
          radiologist: '이민호 전문의',
          priority: 'moderate'
        },
        {
          id: 'X003',
          date: '2024-05-10',
          type: 'PA View',
          aiDiagnosis: '폐렴 호전',
          confidence: 89.1,
          findings: ['우하엽 음영 감소', '기관지 벽 정상화', '전반적 호전'],
          radiologist: '박영수 전문의',
          priority: 'normal'
        },
        {
          id: 'X004',
          date: '2024-07-14',
          type: 'PA View',
          aiDiagnosis: '정상',
          confidence: 94.8,
          findings: ['폐야 완전 회복', '심장 크기 정상', '늑막강 정상'],
          radiologist: '이민호 전문의',
          priority: 'normal'
        }
      ]
    },
    {
      id: 'P002',
      name: '박영희',
      birthDate: '1992-07-22',
      gender: '여',
      phone: '010-2345-6789',
      address: '서울시 서초구',
      xrayHistory: [
        {
          id: 'X005',
          date: '2024-02-28',
          type: 'PA View',
          aiDiagnosis: '결핵 의심',
          confidence: 85.7,
          findings: ['좌상엽 공동성 병변', '림프절 비대', '흉막 비후'],
          radiologist: '김서연 전문의',
          priority: 'high'
        },
        {
          id: 'X006',
          date: '2024-04-15',
          type: 'PA View',
          aiDiagnosis: '결핵 치료 중',
          confidence: 82.4,
          findings: ['공동성 병변 크기 감소', '림프절 크기 감소', '치료 반응 양호'],
          radiologist: '김서연 전문의',
          priority: 'moderate'
        },
        {
          id: 'X007',
          date: '2024-06-30',
          type: 'PA View',
          aiDiagnosis: '결핵 호전',
          confidence: 91.2,
          findings: ['공동 거의 소실', '림프절 정상화', '섬유화 소견'],
          radiologist: '김서연 전문의',
          priority: 'normal'
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchCriteria.name && !searchCriteria.birthDate && !searchCriteria.gender) {
      alert('최소 하나의 검색 조건을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const patient = mockPatients.find(p => {
        const nameMatch = !searchCriteria.name || p.name.includes(searchCriteria.name);
        const birthMatch = !searchCriteria.birthDate || p.birthDate === searchCriteria.birthDate;
        const genderMatch = !searchCriteria.gender || p.gender === searchCriteria.gender;
        
        return nameMatch && birthMatch && genderMatch;
      });

      setSelectedPatient(patient || null);
      setIsLoading(false);
      
      if (!patient) {
        alert('해당 조건에 맞는 환자를 찾을 수 없습니다.');
      }
    }, 800);
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
            paddingTop: '2rem', /* 패딩으로 아래로 내림 */
            lineHeight: '1.6',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            paddingLeft: '0.5rem',
            textAlign: 'left'
          }}
        >
          여기서 환자 정보를 관리하세요.
        </div>
        
        {/* 메인 레이아웃: 좌우 분할 */}
        <div 
          className={styles.mainLayout}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr', /* 오른쪽을 3배로 */
            gap: '2rem',
            height: '100vh',
            overflow: 'hidden',
            alignItems: 'start'
          }}
        >
          {/* 왼쪽: 검색 섹션 (1/3) */}
          <div className={styles.leftSection}>
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{marginRight: '8px'}}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                환자 검색
              </h2>
              
              <div className={styles.searchForm}>
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>환자명:</label>
                  <input
                    type="text"
                    value={searchCriteria.name}
                    onChange={(e) => setSearchCriteria({...searchCriteria, name: e.target.value})}
                    placeholder="이름을 입력하세요"
                    className={styles.inputID}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>생년월일:</label>
                  <input
                    type="text"
                    value={searchCriteria.birthDate}
                    onChange={(e) => setSearchCriteria({...searchCriteria, birthDate: e.target.value})}
                    placeholder="YYYY-MM-DD (예: 1979-03-15)"
                    className={styles.inputID}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.patientID}>성별:</label>
                  <select
                    value={searchCriteria.gender}
                    onChange={(e) => setSearchCriteria({...searchCriteria, gender: e.target.value})}
                    className={styles.inputID}
                  >
                    <option value="">선택하세요</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
                
                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={styles.button}
                  >
                    {isLoading ? '검색 중...' : '검색'}
                  </button>
                  <button
                    onClick={handleReset}
                    className={styles.resetButton}
                  >
                    초기화
                  </button>
                </div>
              </div>
              
              <div className={styles.sampleIds}>
                <strong>샘플 데이터:</strong> 김철수 (1979-03-15, 남), 박영희 (1992-07-22, 여)
              </div>
            </div>
          </div>

          {/* 오른쪽: 검색 결과 (2/3) */}
          <div className={styles.rightSection}>
            {selectedPatient ? (
              <div className={styles.patientSection}>
                {/* 환자 기본 정보 */}
                <div className={styles.patientCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.patientName}>{selectedPatient.name}</h3>
                      <p className={styles.patientId}>환자 ID: {selectedPatient.id}</p>
                    </div>
                    <div className={styles.patientDetails}>
                      <p>생년월일: {selectedPatient.birthDate}</p>
                      <p>성별: {selectedPatient.gender}</p>
                      <p>연락처: {selectedPatient.phone}</p>
                    </div>
                  </div>
                </div>

                {/* 엑스레이 기록 */}
                <div className={styles.xraySection}>
                  <h4 className={styles.sectionTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" style={{marginRight: '8px'}}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    흉부 엑스레이 기록
                  </h4>
                  
                  <div className={styles.recordsContainer}>
                    {selectedPatient.xrayHistory.map((xray) => (
                      <div key={xray.id} className={styles.recordCard}>
                        <div className={styles.recordLayout}>
                          {/* 기본 정보 */}
                          <div className={styles.recordInfo}>
                            <div className={styles.recordHeader}>
                              <span className={`${styles.badge} ${styles[getPriorityClass(xray.priority)]}`}>
                                {getPriorityIcon(xray.priority)} {xray.aiDiagnosis}
                              </span>
                              <span className={styles.recordDate}>{xray.date}</span>
                              <span className={styles.recordConfidence}>예측 정확도: {xray.confidence}%</span>
                            </div>
                            
                            <div className={styles.recordDetails}>
                              <div className={styles.detailColumn}>
                                <p className={styles.detailItem}>촬영 유형: {xray.type}</p>
                                <p className={styles.detailItem}>판독의: {xray.radiologist}</p>
                              </div>
                              
                              <div className={styles.detailColumn}>
                                <h5 className={styles.findingsTitle}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" style={{marginRight: '6px'}}>
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                    <polyline points="14,2 14,8 20,8"></polyline>
                                  </svg>
                                  AI 판독 소견
                                </h5>
                                <ul className={styles.findingsList}>
                                  {xray.findings.map((finding, index) => (
                                    <li key={index}>{finding}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          {/* 이미지 미리보기 */}
                          <div className={styles.imagePreview}>
                            <div className={styles.previewContainer}>
                              <div className={styles.previewPlaceholder}>
                                <div>엑스레이 이미지</div>
                                <div className={styles.imageId}>({xray.id})</div>
                              </div>
                              <button className={styles.saveButton} title="이미지 저장">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7,10 12,15 17,10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !isLoading ? (
              <div className={styles.emptyState}>
                <p>환자를 검색하면 엑스레이 기록이 여기에 표시됩니다.</p>
                <div className={styles.sampleIds}>
                  <strong>샘플 데이터를 사용해보세요!</strong>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patient;