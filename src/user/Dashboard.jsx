import React, { useEffect, useRef, useState } from 'react';
import styles from './Dashboard.module.css';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Play,
  Brain,
  Shield,
  Clock,
  FileText,
  ChevronRight,
  Heart,
  Stethoscope,
  Check
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from 'recharts';
import megaphoneImg from '../assets/Megaphone.png';
import profileImg from '../assets/profile.jpg';
import frmaeImg from '../assets/ProfileFrame.png';

function Dashboard() {
    const nickname = localStorage.getItem('nickname');
    
    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const [chartType, setChartType] = useState('weekly');
    const [checkedSchedules, setCheckedSchedules] = useState({});

    useEffect(() => {
        // 헤더 애니메이션
        if (headerRef.current) {
            headerRef.current.style.opacity = '0';
            headerRef.current.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (headerRef.current) {
                    headerRef.current.style.transition = 'all 0.8s ease';
                    headerRef.current.style.opacity = '1';
                    headerRef.current.style.transform = 'translateY(0)';
                }
            }, 100);
        }

        // 카드 순차 애니메이션
        cardsRef.current.forEach((card, index) => {
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    if (card) {
                        card.style.transition = 'all 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                }, 200 + index * 100);
            }
        });

        // 파이차트 호버 이벤트
        const addPieHoverEvents = () => {
            // 기본 recharts 툴팁 사용으로 단순화
        };

        setTimeout(addPieHoverEvents, 500);
    }, [chartType]);

    // 샘플 데이터
    const weeklyData = [
        { day: '월', abnormal: 17, normal: 28 },
        { day: '화', abnormal: 21, normal: 31 },
        { day: '수', abnormal: 16, normal: 22 },
        { day: '목', abnormal: 26, normal: 35 },
        { day: '금', abnormal: 22, normal: 33 },
        { day: '토', abnormal: 17, normal: 25 },
        { day: '일', abnormal: 14, normal: 21 }
    ];

    const monthlyData = [
        { month: '1월', diagnoses: 320 },
        { month: '2월', diagnoses: 285 },
        { month: '3월', diagnoses: 410 },
        { month: '4월', diagnoses: 375 },
        { month: '5월', diagnoses: 455 },
        { month: '6월', diagnoses: 520 }
    ];

    const diseaseData = [
        { name: '정상', value: 65, color: '#f7e99c' },
        { name: '폐렴', value: 20, color: '#bbc9f7' },
        { name: '결핵', value: 10, color: '#c3e1ad' },
        { name: '기타', value: 5, color: '#a3d5f7' }
    ];

    const recentDiagnoses = [
        { id: 'P001', disease: '폐렴 의심', confidence: 94, time: '15분 전', severity: 'high' },
        { id: 'P002', disease: '정상', confidence: 98, time: '23분 전', severity: 'normal' },
        { id: 'P003', disease: '결핵 의심', confidence: 87, time: '1시간 전', severity: 'critical' },
        { id: 'P004', disease: '정상', confidence: 95, time: '2시간 전', severity: 'normal' }
    ];

    const appointments = [
        { doctor: 'Dr. Kim', time: '14:00', patient: 'P005', type: '상담' },
        { doctor: 'Dr. Lee', time: '15:30', patient: 'P006', type: '재검토' },
        { doctor: 'Dr. Park', time: '16:00', patient: 'P007', type: '상담' }
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return { 
                outer: '#bbc9f7', 
                inner: '#e6ecff',
                gradient: 'linear-gradient(135deg, #bbc9f7, #e6ecff)'
            };
            case 'high': return { 
                outer: '#f7e99c', 
                inner: '#fef4d6',
                gradient: 'linear-gradient(135deg, #f7e99c, #fef4d6)'
            };
            default: return { 
                outer: '#c3e1ad', 
                inner: '#e8f5d8',
                gradient: 'linear-gradient(135deg, #c3e1ad, #e8f5d8)'
            };
        }
    };

    const toggleSchedule = (index) => {
        setCheckedSchedules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.body}>
                {/* 헤더 */}
                <div ref={headerRef} className={styles.header}>
                    <div className={styles.greetingSection}>
                        <div className={styles.greetingContent}>
                            <h1 className={styles.greeting}>
                                안녕하세요 {nickname}님, 오늘 하루는 어떠신가요?
                            </h1>
                        </div>
                    </div>
                </div>

                {/* 카드 그리드 */}
                <div className={styles.cardGrid}>
                    
                    {/* 통계 섹션 */}
                    <div className={styles.statsSection}>
                        <div 
                            ref={el => {
                                if (el) cardsRef.current[0] = el;
                            }}
                            className={styles.statCard}
                        >
                            <div className={styles.statHeader}>
                                <Users size={18} color="#313a54" />
                                <h3 className={styles.statTitle}>총 진단 환자</h3>
                            </div>
                            <div className={styles.statContainer}>
                                <span className={styles.statNumberWithGauge}>1,247</span>
                                <span className={`${styles.statBadge} ${styles.statBadgeBlue}`}>+15%</span>
                            </div>
                            <p className={styles.statDescription}>
                                지난 3개월 동안 진단된 환자 수
                            </p>
                        </div>

                        <div 
                            ref={el => {
                                if (el) cardsRef.current[1] = el;
                            }}
                            className={styles.statCard}
                        >
                            <div className={styles.statHeader}>
                                <Activity size={18} color="#313a54" />
                                <h3 className={styles.statTitle}>AI 진단 정확도</h3>
                            </div>
                            <div className={styles.statContainer}>
                                <span className={styles.statNumberWithGauge}>96.8%</span>
                                <span className={`${styles.statBadge} ${styles.statBadgeGreen}`}>+2.3%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progressFill} 
                                    style={{ width: '96.8%' }}
                                ></div>
                            </div>
                            <p className={styles.statDescription}>
                                AI 모델로 빠르고 정확한 폐 질환 진단
                            </p>
                        </div>
                    </div>

                    {/* 나의 프로필 */}
                    <div 
                        ref={el => {
                            if (el) cardsRef.current[4] = el;
                        }}
                        className={`${styles.card} ${styles.profileCard}`}
                    >
                        <div className={styles.profileAvatar}>
                            <div className={styles.avatarCircle}>
                                <img src={profileImg} alt="프로필" className={styles.avatarImage} />
                                <img src={frmaeImg} alt="프레임" className={styles.avatarFrame} />
                            </div>
                        </div>
                        <div className={styles.profileName}>{nickname}</div>
                        <div className={styles.profileRole}>방사선과 전문의</div>
                        <div className={styles.profileDesc}>AI와 함께하는 스마트 판독<br/>오늘도 힘내세요!</div>
                    </div>

                    {/* 주간 진단 통계 */}
                    <div 
                        ref={el => {
                            if (el) cardsRef.current[2] = el;
                        }}
                        className={`${styles.card} ${styles.cardWide}`}
                    >
                        <div className={styles.cardHeaderRow}>
                            <div className={styles.cardHeaderWithIcon}>
                                <TrendingUp size={18} color="#313a54" />
                                <h3 className={styles.cardTitle}>
                                    {chartType === 'weekly' ? '주간 진단 통계' : '월간 진단 통계'}
                                </h3>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button 
                                    className={chartType === 'weekly' ? styles.buttonActive : styles.buttonSecondary}
                                    onClick={() => setChartType('weekly')}
                                >
                                    주간
                                </button>
                                <button 
                                    className={chartType === 'monthly' ? styles.buttonActive : styles.buttonSecondary}
                                    onClick={() => setChartType('monthly')}
                                >
                                    월간
                                </button>
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'weekly' ? (
                                    <BarChart data={weeklyData} margin={{ top: 25, right: 40, left: 25, bottom: 10 }} barCategoryGap="15%">
                                        <defs>
                                            <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#87ceeb" />
                                                <stop offset="50%" stopColor="#6bb6ff" />
                                                <stop offset="100%" stopColor="#5aa3e6" />
                                            </linearGradient>
                                            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="6" height="6">
                                                <rect width="6" height="6" fill="#f9fafb"/>
                                                <path d="M0,6 l6,-6 M-1,1 l2,-2 M5,7 l2,-2" stroke="#9CA3AF" strokeWidth="1"/>
                                            </pattern>
                                        </defs>
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                        />
                                        <Bar 
                                            dataKey="abnormal" 
                                            stackId="stack"
                                            fill="url(#diagonalHatch)"
                                            radius={[9, 9, 9, 9]}
                                        />
                                        <Bar 
                                            dataKey="normal" 
                                            stackId="stack"
                                            fill="url(#brandGradient)"
                                            radius={[9, 9, 9, 9]}
                                        />
                                    </BarChart>
                                ) : (
                                    <LineChart data={monthlyData} margin={{ top: 25, right: 40, left: 25, bottom: 10 }}>
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                        />
                                        <Line 
                                            type="linear" 
                                            dataKey="diagnoses" 
                                            stroke="url(#lineGradient)" 
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={false}
                                        />
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#87ceeb" />
                                                <stop offset="50%" stopColor="#6bb6ff" />
                                                <stop offset="100%" stopColor="#5aa3e6" />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 최근 진단 기록 */}
                    <div 
                        ref={el => {
                            if (el) cardsRef.current[5] = el;
                        }}
                        className={`${styles.card} ${styles.cardWide}`}
                    >
                        <div className={styles.cardHeaderRow}>
                            <div className={styles.cardHeaderWithIcon}>
                                <FileText size={18} color="#313a54" />
                                <h3 className={styles.cardTitle}>최근 진단 기록</h3>
                            </div>
                            <button className={styles.buttonSecondary}>전체 보기</button>
                        </div>
                        <div className={styles.recordsList}>
                            {recentDiagnoses.map((diagnosis, index) => (
                                <div key={index} className={styles.recordItem}>
                                    <div className={styles.recordLeft}>
                                        <div 
                                            className={styles.severityDot}
                                            style={{ 
                                                background: getSeverityColor(diagnosis.severity).gradient,
                                                boxShadow: `0 0 12px ${getSeverityColor(diagnosis.severity).outer}80`
                                            }}
                                        ></div>
                                        <div>
                                            <div className={styles.recordPatient}>
                                                환자 {diagnosis.id}
                                            </div>
                                            <div className={styles.recordDetails}>
                                                {diagnosis.disease} - 신뢰도 {diagnosis.confidence}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.recordRight}>
                                        <div className={styles.recordTime}>{diagnosis.time}</div>
                                        <Play size={12} color="#313a54" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 긴급 알림 */}
                    <div 
                        ref={el => {
                            if (el) cardsRef.current[3] = el;
                        }}
                        className={styles.urgentCard}
                    >
                        <div className={styles.urgentBackground}></div>
                        <div className={styles.urgentMegaphone}>
                            <img
                                src={megaphoneImg}
                                alt="Megaphone"
                                className={styles.megaphoneImage}
                                style={{ width: '200px', height: '200px' }}
                            />
                        </div>
                        <div className={styles.urgentContent}>
                            <div className={styles.urgentTop}>
                                <h3 className={styles.urgentTitle}>긴급 진단 알림</h3>
                                <p className={styles.urgentDescription}>
                                    즉시 확인이 필요한 고위험 진단 결과가 있습니다.
                                </p>
                            </div>
                            <div className={styles.urgentAlert}>
                                <AlertTriangle size={20} color="#ffffff" />
                                <span>3건의 알림</span>
                            </div>
                            <button className={styles.urgentButton}>
                                확인하기 <ChevronRight size={16} color="#ffffff" />
                            </button>
                        </div>
                    </div>

                    {/* 병원 일정 */}
                    <div 
                        ref={el => {
                            if (el) cardsRef.current[7] = el;
                        }}
                        className={styles.card}
                    >
                        <div className={styles.cardHeaderRow}>
                            <div className={styles.cardHeaderWithIcon}>
                                <Calendar size={18} color="#313a54" />
                                <h3 className={styles.cardTitle}>병원 일정</h3>
                            </div>
                            <button className={styles.buttonSecondary}>전체 보기</button>
                        </div>
                        <div className={styles.scheduleList}>
                            <div className={styles.scheduleItem}>
                                <div className={styles.scheduleTime}>08:00</div>
                                <div className={styles.scheduleContent}>
                                    <div className={styles.scheduleTitle}>병동 라운딩</div>
                                    <div className={styles.scheduleSubtitle}>3층 병동</div>
                                </div>
                                <div 
                                    className={`${styles.scheduleCheckbox} ${checkedSchedules[0] ? styles.checked : ''}`}
                                    onClick={() => toggleSchedule(0)}
                                >
                                    {checkedSchedules[0] && <Check size={12} color="#5aa3e6" />}
                                </div>
                            </div>
                            <div className={styles.scheduleItem}>
                                <div className={styles.scheduleTime}>12:30</div>
                                <div className={styles.scheduleContent}>
                                    <div className={styles.scheduleTitle}>의료진 회의</div>
                                    <div className={styles.scheduleSubtitle}>회의실 A</div>
                                </div>
                                <div 
                                    className={`${styles.scheduleCheckbox} ${checkedSchedules[1] ? styles.checked : ''}`}
                                    onClick={() => toggleSchedule(1)}
                                >
                                    {checkedSchedules[1] && <Check size={12} color="#5aa3e6" />}
                                </div>
                            </div>
                            <div className={styles.scheduleItem}>
                                <div className={styles.scheduleTime}>19:00</div>
                                <div className={styles.scheduleContent}>
                                    <div className={styles.scheduleTitle}>케이스 컨퍼런스</div>
                                    <div className={styles.scheduleSubtitle}>강당</div>
                                </div>
                                <div 
                                    className={`${styles.scheduleCheckbox} ${checkedSchedules[2] ? styles.checked : ''}`}
                                    onClick={() => toggleSchedule(2)}
                                >
                                    {checkedSchedules[2] && <Check size={12} color="#5aa3e6" />}
                                </div>
                            </div>
                            <div className={styles.scheduleItem}>
                                <div className={styles.scheduleTime}>20:00</div>
                                <div className={styles.scheduleContent}>
                                    <div className={styles.scheduleTitle}>야간 당직</div>
                                    <div className={styles.scheduleSubtitle}>응급실</div>
                                </div>
                                <div 
                                    className={`${styles.scheduleCheckbox} ${checkedSchedules[3] ? styles.checked : ''}`}
                                    onClick={() => toggleSchedule(3)}
                                >
                                    {checkedSchedules[3] && <Check size={12} color="#5aa3e6" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;