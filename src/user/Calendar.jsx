import React, { useState, useEffect, useMemo } from 'react';
import { 
    Plus, 
    Trash2, 
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Circle,
    Edit
} from 'lucide-react';
import styles from './Calendar.module.css';

function Calendar() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newTodo, setNewTodo] = useState('');
    
    // 할일 목록 데이터
    const [todos, setTodos] = useState([
        { id: 1, text: 'CT 판독 보고서 작성', completed: false },
        { id: 2, text: 'MRI 스캔 결과 검토', completed: true },
        { id: 3, text: '환자 상담 준비', completed: false },
        { id: 4, text: '의료진 회의 자료 준비', completed: false },
        { id: 5, text: '장비 점검 스케줄 확인', completed: true }
    ]);
    
    // 캘린더 일정 데이터
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            day: 0,
            time: '09:00',
            duration: 2,
            title: 'CT 판독',
            description: '흉부 CT 판독 업무'
        },
        {
            id: 2,
            day: 0,
            time: '11:00',
            duration: 1,
            title: '초음파 검사',
            description: '복부 초음파 검사'
        },
        {
            id: 3,
            day: 1,
            time: '14:00',
            duration: 2,
            title: '응급 검사',
            description: '응급실 의뢰 검사'
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        time: '09:00',
        duration: 1,
        description: ''
    });

    // 현재 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // 시간 슬롯 (9시~18시)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // 요일 이름
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // useMemo를 사용해서 계산된 값들을 안전하게 처리
    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentWeek);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek);
            weekDate.setDate(startOfWeek.getDate() + i);
            dates.push(weekDate);
        }
        return dates;
    }, [currentWeek]);

    const currentTimePosition = useMemo(() => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (currentHour < 9 || currentHour >= 19) {
            return null;
        }
        
        const slotHour = Math.floor(currentHour);
        const relativeSlot = slotHour - 9;
        const minutePercent = currentMinute / 60;
        const position = relativeSlot * 60 + (minutePercent * 60);
        
        return position;
    }, [currentTime]);

    const currentDayIndex = useMemo(() => {
        const today = new Date();
        
        for (let i = 0; i < weekDates.length; i++) {
            if (today.toDateString() === weekDates[i].toDateString()) {
                return i;
            }
        }
        return null;
    }, [weekDates]);

    // 할일 관련 함수들
    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos(prev => [...prev, {
                id: Date.now(),
                text: newTodo.trim(),
                completed: false
            }]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    // 캘린더 관련 함수들
    const getAppointmentAt = (dayIndex, timeSlot) => {
        return appointments.find(apt => 
            apt.day === dayIndex && 
            apt.time === timeSlot
        );
    };

    // 시간을 분으로 변환하는 함수
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // 일정이 해당 시간 슬롯과 겹치는지 확인
    const isAppointmentInTimeSlot = (appointment, timeSlot) => {
        const aptStartMinutes = timeToMinutes(appointment.time);
        const aptEndMinutes = aptStartMinutes + (appointment.duration * 60);
        const slotStartMinutes = timeToMinutes(timeSlot);
        const slotEndMinutes = slotStartMinutes + 60;
        
        return aptStartMinutes < slotEndMinutes && aptEndMinutes > slotStartMinutes;
    };

    // 일정이 시작되는 시간 슬롯인지 확인
    const isAppointmentStart = (appointment, timeSlot) => {
        return appointment.time === timeSlot;
    };

    const changeWeek = (direction) => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction * 7));
        setCurrentWeek(newWeek);
    };

    const handleTimeSlotClick = (dayIndex, timeSlot) => {
        setSelectedSlot({ day: dayIndex, time: timeSlot });
        setFormData({
            title: '',
            time: timeSlot,
            duration: 1,
            description: ''
        });
        setEditingEvent(null);
        setShowModal(true);
    };

    const handleAppointmentClick = (appointment, e) => {
        e.stopPropagation();
        setEditingEvent(appointment);
        setSelectedSlot({ day: appointment.day, time: appointment.time });
        setFormData({
            title: appointment.title,
            time: appointment.time,
            duration: appointment.duration,
            description: appointment.description
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingEvent) {
            setAppointments(prev => prev.map(apt => 
                apt.id === editingEvent.id 
                    ? { 
                        ...apt, 
                        title: formData.title,
                        time: formData.time,
                        duration: formData.duration,
                        description: formData.description
                    }
                    : apt
            ));
            setEditingEvent(null);
        } else {
            const newAppointment = {
                id: Date.now(),
                day: selectedSlot?.day || currentDayIndex || 0,
                time: formData.time,
                duration: formData.duration,
                title: formData.title,
                description: formData.description
            };
            setAppointments(prev => [...prev, newAppointment]);
        }
        
        setFormData({
            title: '',
            time: '09:00',
            duration: 1,
            description: ''
        });
        setSelectedSlot(null);
        setShowModal(false);
    };

    const handleDelete = (appointmentId) => {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        setShowModal(false);
        setEditingEvent(null);
    };

    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalTodos = todos.length;

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {/* 왼쪽 할일 체크리스트 */}
                <div className={styles.leftSidebar}>
                    <h1 className={styles.greeting}>
                        일정을 한눈에 확인해보세요 📅
                    </h1>
                    
                    {/* 진행률 표시 */}
                    <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                            <span className={styles.progressText}>진행률</span>
                            <span className={styles.progressNumbers}>{completedTodos}/{totalTodos}</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill}
                                style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className={styles.progressPercentage}>
                            {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}% 완료
                        </div>
                    </div>

                    {/* 새 할일 추가 */}
                    <div className={styles.addTodoSection}>
                        <div className={styles.addTodoInput}>
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="새 할일을 입력하세요..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        addTodo();
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px 0 0 8px',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={addTodo}
                                style={{
                                    background: 'linear-gradient(135deg, #87ceeb, #6bb6ff)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0 8px 8px 0',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* 할일 목록 */}
                    <div className={styles.todoList}>
                        {todos.map(todo => (
                            <div 
                                key={todo.id} 
                                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                            >
                                <button
                                    className={`${styles.todoCheckbox} ${todo.completed ? styles.checked : ''}`}
                                    onClick={() => toggleTodo(todo.id)}
                                    style={{
                                        color: todo.completed ? '#6b7280' : '#6b7280'
                                    }}
                                >
                                    <Check size={12} style={{ opacity: todo.completed ? 1 : 0 }} />
                                </button>
                                
                                <div className={styles.todoContent}>
                                    <span className={todo.completed ? styles.todoTextCompleted : styles.todoText}>
                                        {todo.text}
                                    </span>
                                    <div className={styles.todoActions}>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className={styles.todoDeleteBtn}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽 캘린더 */}
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
                                                <div 
                                                    key={timeSlot} 
                                                    className={styles.timeCell}
                                                    onClick={() => !appointment && handleTimeSlotClick(dayIndex, timeSlot)}
                                                >
                                                    {appointment && (
                                                        <div 
                                                            className={styles.appointment}
                                                            onClick={(e) => handleAppointmentClick(appointment, e)}
                                                        >
                                                            <div className={styles.appointmentTitle}>
                                                                {appointment.title}
                                                            </div>
                                                            <div className={styles.appointmentTime}>
                                                                {appointment.time}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        
                                        {/* 현재 시간 표시선 */}
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

            {/* 캘린더 일정 추가/수정 모달 */}
            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingEvent ? '일정 수정' : '새 일정 추가'}
                            </h3>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                <label style={{fontSize: '0.9rem', fontWeight: '500', color: '#374151'}}>제목 *</label>
                                <input
                                    type="text"
                                    style={{
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontFamily: 'inherit'
                                    }}
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="일정 제목을 입력하세요"
                                    required
                                />
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label style={{fontSize: '0.9rem', fontWeight: '500', color: '#374151'}}>시작 시간 *</label>
                                    <select
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            backgroundColor: 'white',
                                            fontFamily: 'inherit'
                                        }}
                                        value={formData.time}
                                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                        required
                                    >
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label style={{fontSize: '0.9rem', fontWeight: '500', color: '#374151'}}>소요 시간</label>
                                    <select
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            backgroundColor: 'white',
                                            fontFamily: 'inherit'
                                        }}
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    >
                                        <option value={1}>1시간</option>
                                        <option value={2}>2시간</option>
                                        <option value={3}>3시간</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                <label style={{fontSize: '0.9rem', fontWeight: '500', color: '#374151'}}>메모</label>
                                <textarea
                                    style={{
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        minHeight: '100px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="추가 메모사항을 입력하세요"
                                />
                            </div>

                            <div style={{display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end'}}>
                                {editingEvent && (
                                    <button
                                        type="button"
                                        style={{
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onClick={() => {
                                            if (window.confirm('이 일정을 삭제하시겠습니까?')) {
                                                handleDelete(editingEvent.id);
                                            }
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        삭제
                                    </button>
                                )}
                                <button
                                    type="button"
                                    style={{
                                        background: 'white',
                                        color: '#374151',
                                        border: '1px solid #d1d5db',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.9rem'
                                    }}
                                    onClick={() => setShowModal(false)}
                                >
                                    취소
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #87ceeb, #6bb6ff)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Check size={16} />
                                    {editingEvent ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;