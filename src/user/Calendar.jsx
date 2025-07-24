import React, { useState, useEffect } from 'react';
import { 
    AlertTriangle, 
    Activity, 
    CheckCircle, 
    Clock, 
    Users, 
    Calendar as CalendarIcon,
    MapPin,
    Video,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    Heart,
    BarChart3
} from 'lucide-react';
import styles from './Calendar.module.css';

function Calendar() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    // 현재 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 1분마다 업데이트

        return () => clearInterval(timer);
    }, []);

    // 시간 슬롯 (9시~18시)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // 요일 이름
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // 현재 주의 날짜들을 계산
    const getWeekDates = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek);
            weekDate.setDate(startOfWeek.getDate() + i);
            weekDates.push(weekDate);
        }
        return weekDates;
    };

    const weekDates = getWeekDates(currentWeek);

    // 샘플 일정 데이터
    const appointments = [
        { id: 1, day: 0, time: '09:00', duration: 1, patient: '김○○', type: '초진' },
        { id: 2, day: 0, time: '10:30', duration: 1, patient: '이○○', type: '재진' },
        { id: 3, day: 1, time: '14:00', duration: 2, patient: '박○○', type: '검진' },
        { id: 4, day: 2, time: '09:30', duration: 1, patient: '최○○', type: '상담' },
        { id: 5, day: 4, time: '15:00', duration: 1, patient: '정○○', type: '초진' },
    ];

    // 응급 알림
    const emergencyAlerts = [
        { id: 1, time: '13:45', patient: '응급환자', message: '흉통 호소, 즉시 진료 필요', priority: 'high' },
        { id: 2, time: '14:20', patient: '응급환자', message: '호흡곤란, 응급실 이송 중', priority: 'critical' }
    ];

    // 오늘의 통계
    const todayStats = [
        { label: '예정 진료', value: '12명', icon: CalendarIcon },
        { label: '완료 진료', value: '8명', icon: CheckCircle },
        { label: '대기 환자', value: '4명', icon: Clock },
        { label: '응급 환자', value: '2명', icon: AlertTriangle }
    ];

    // 병원 일정
    const hospitalSchedule = [
        { id: 1, time: '08:00', title: '병동 라운딩', type: 'rounds', location: '3층 병동', icon: Stethoscope },
        { id: 2, time: '12:30', title: '의료진 회의', type: 'meeting', location: '회의실 A', icon: Users },
        { id: 3, time: '19:00', title: '케이스 컨퍼런스', type: 'conference', location: '강당', icon: Video },
        { id: 4, time: '20:00', title: '야간 당직', type: 'duty', location: '응급실', icon: Heart }
    ];

    // 현재 시간이 표시 범위 내에 있는지 확인
    const getCurrentTimePosition = () => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // 9시~19시 범위 내에서만 표시 (18:00까지 포함하려면 19시 미만)
        if (currentHour < 9 || currentHour >= 19) {
            return null;
        }
        
        // 해당 시간 슬롯 찾기 (예: 10:30은 10:00 슬롯)
        const slotHour = Math.floor(currentHour);
        const relativeSlot = slotHour - 9; // 9시를 0번째 슬롯으로
        
        // 해당 슬롯 내에서의 분 비율 (0~1)
        const minutePercent = currentMinute / 60;
        
        // 슬롯 시작점 + 슬롯 내 위치
        const position = relativeSlot * 60 + (minutePercent * 60);
        
        return position;
    };

    // 현재 요일 확인 (월요일=0, 일요일=6)
    const getCurrentDayIndex = () => {
        const today = new Date();
        const currentWeekDates = getWeekDates(currentWeek);
        
        // 오늘이 현재 표시된 주에 속하는지 확인
        for (let i = 0; i < currentWeekDates.length; i++) {
            if (today.toDateString() === currentWeekDates[i].toDateString()) {
                return i;
            }
        }
        return null;
    };

    const currentTimePosition = getCurrentTimePosition();
    const currentDayIndex = getCurrentDayIndex();

    // 주 변경
    const changeWeek = (direction) => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction * 7));
        setCurrentWeek(newWeek);
    };

    // 특정 시간과 요일에 일정이 있는지 확인
    const getAppointmentAt = (dayIndex, timeSlot) => {
        return appointments.find(apt => 
            apt.day === dayIndex && 
            apt.time === timeSlot
        );
    };

    // 오늘 날짜 포맷팅
    const getTodayDateString = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        return `${month}월 ${date}일`;
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {/* 왼쪽 사이드바 */}
                <div className={styles.leftSidebar}>
                    {/* 인사말 */}
                    <h1 className={styles.greeting}>
                        {getTodayDateString()}의 진료 일정
                    </h1>
                    
                    {/* 스크롤 영역 */}
                    <div className={styles.sidebarContent}>
                        {/* 응급 알림 */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <AlertTriangle size={18} />
                                응급 알림
                            </h3>
                            <div className={styles.alertsList}>
                                {emergencyAlerts.map(alert => (
                                    <div key={alert.id} className={`${styles.alert} ${styles[alert.priority]}`}>
                                        <div className={styles.alertHeader}>
                                            <span className={styles.alertTime}>{alert.time}</span>
                                            <span className={styles.alertPatient}>{alert.patient}</span>
                                        </div>
                                        <div className={styles.alertMessage}>{alert.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 오늘의 통계 */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <BarChart3 size={18} />
                                오늘의 통계
                            </h3>
                            <div className={styles.statsList}>
                                {todayStats.map((stat, index) => {
                                    const IconComponent = stat.icon;
                                    return (
                                        <div key={index} className={styles.statItem}>
                                            <div className={styles.statIcon}>
                                                <IconComponent size={20} />
                                            </div>
                                            <div className={styles.statContent}>
                                                <div className={styles.statLabel}>{stat.label}</div>
                                                <div className={styles.statValue}>{stat.value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 병원 일정 */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <MapPin size={18} />
                                병원 일정
                            </h3>
                            <div className={styles.scheduleList}>
                                {hospitalSchedule.map(item => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={item.id} className={styles.scheduleItem}>
                                            <div className={styles.scheduleTime}>{item.time}</div>
                                            <div className={styles.scheduleContent}>
                                                <div className={styles.scheduleTitle}>
                                                    <IconComponent size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
                                                    {item.title}
                                                </div>
                                                <div className={styles.scheduleLocation}>{item.location}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 주단위 캘린더 */}
                <div className={styles.calendarSection}>
                    <div className={styles.weekCalendar}>
                        {/* 캘린더 헤더 */}
                        <div className={styles.calendarHeader}>
                            <button 
                                className={styles.navButton}
                                onClick={() => changeWeek(-1)}
                            >
                                <ChevronLeft size={16} />
                                이전 주
                            </button>
                            <h2 className={styles.weekTitle}>
                                {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 ~ {weekDates[6].getDate()}일
                            </h2>
                            <button 
                                className={styles.navButton}
                                onClick={() => changeWeek(1)}
                            >
                                다음 주
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* 주단위 캘린더 그리드 */}
                        <div className={styles.calendarGrid}>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeHeader}>시간</div>
                                {timeSlots.map(time => (
                                    <div key={time} className={styles.timeSlot}>
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* 각 요일 컬럼 */}
                            {dayNames.map((dayName, dayIndex) => (
                                <div key={dayIndex} className={styles.dayColumn}>
                                    <div className={`${styles.dayHeader} ${dayIndex === currentDayIndex ? styles.today : ''}`}>
                                        <div className={styles.dayName}>{dayName}</div>
                                        <div className={styles.dayDate}>
                                            {weekDates[dayIndex].getDate()}
                                        </div>
                                    </div>
                                    
                                    {/* 시간 슬롯들 */}
                                    <div className={styles.dayTimeSlots}>
                                        {timeSlots.map(timeSlot => {
                                            const appointment = getAppointmentAt(dayIndex, timeSlot);
                                            return (
                                                <div key={timeSlot} className={styles.timeCell}>
                                                    {appointment && (
                                                        <div className={styles.appointment}>
                                                            <div className={styles.appointmentPatient}>
                                                                {appointment.patient}
                                                            </div>
                                                            <div className={styles.appointmentType}>
                                                                {appointment.type}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        
                                        {/* 현재 시간 표시선 - 오늘 요일에만 표시 */}
                                        {dayIndex === currentDayIndex && currentTimePosition !== null && (
                                            <div 
                                                className={styles.currentTimeLine}
                                                style={{ 
                                                    top: `${60 + currentTimePosition}px`
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;