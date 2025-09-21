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

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Calendar() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newTodo, setNewTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [loadingTodos, setLoadingTodos] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const [isLoading, setIsLoading] = useState(false);

    // 시계 업데이트
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getToday = () => new Date().toISOString().split("T")[0];

    const fetchTodayTodos = async () => {
        setIsLoading(true);
        const today = getToday();
        const url = `${SERVER_URL}/schedule/todos?date=${today}`;

        try {
            const res = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (!res.ok) throw new Error("API 요청 실패");
            const data = await res.json();
            console.log(data);
            setTodos(data);
        } catch (error) {
            console.error("할 일 조회 중 오류:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayTodos();
    }, []);

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

    const addTodo = async () => {
        const today = getToday();
        try {
            const response = await fetch(`${SERVER_URL}/schedule/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    content: newTodo,
                    targetDate: today,
                }),
            });

            if (response.ok) {
                alert("할 일이 성공적으로 등록되었습니다!");
                setNewTodo("");
                fetchTodayTodos();
            } else {
                alert("할 일 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("Error", err);
            alert("네트워크 오류가 발생했습니다.");
        }
    };

    const toggleTodo = async (todoId) => {
        setLoadingTodos(prev => [...prev, todoId]);
        try {
            const response = await fetch(`${SERVER_URL}/schedule/todos/${todoId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('토글 실패');

            setTodos(prev =>
                prev.map(todo =>
                    todo.todoId === todoId ? { ...todo, completed: !todo.completed } : todo
                )
            );
        } catch (err) {
            console.error('Error toggling todo:', err);
            alert('할 일 상태 변경에 실패했습니다.');
        }
    };

    const deleteTodo = async (todoId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await fetch(`${SERVER_URL}/schedule/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            setTodos(prev => prev.filter(todo => todo.todoId !== todoId));
            alert("삭제 완료!");
        } catch (err) {
            console.error("삭제 오류:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    // 캘린더 관련 함수들
    const getAppointmentAt = (dayIndex, timeSlot) => {
        return appointments.find(apt =>
            apt.day === dayIndex &&
            apt.time === timeSlot
        );
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
                <div className={styles.leftSidebar}>
                    <h1 className={styles.greeting}>
                        오늘의 할 일
                    </h1>
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
                    <div className={styles.addTodoSection}>
                        <div className={styles.addTodoInput}>
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="새 할 일을 입력하세요"
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
                    <div>
                        <div className={styles.todoList}>
                            {isLoading ? (
                                <div>로딩 중...</div>
                            ) : todos.length === 0 ? (
                                <div>할 일이 없습니다.</div>
                            ) : (
                                todos.map((todo) => (
                                    <div
                                        key={todo.todoId}
                                        className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}
                                    >
                                        {/* 체크박스 버튼 */}
                                        <button
                                            className={`${styles.todoCheckbox} ${todo.completed ? styles.checked : ""}`}
                                            onClick={() => toggleTodo(todo.todoId)}
                                            disabled={loadingTodos.includes(todo.todoId)}
                                            style={{
                                                color: "#6b7280",
                                            }}
                                        >
                                            <Check size={12} style={{ opacity: todo.completed ? 1 : 0 }} />
                                        </button>

                                        {/* 내용 영역 */}
                                        <div className={styles.todoContent}>
                                            <div className={styles.todoDetails}>
                                                {todo.content}
                                            </div>
                                            <div className={styles.todoActions}>
                                                <button
                                                    onClick={() => deleteTodo(todo.todoId)}
                                                    className={styles.todoDeleteBtn}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                                <div className={styles.dayColumn} style={{ position: 'relative' }}>
                                    <div className={`${styles.dayHeader} ${dayIndex === currentDayIndex ? styles.today : ''}`}>
                                        <div className={styles.dayName}>{dayName}</div>
                                        <div className={styles.dayDate}>{weekDates[dayIndex].getDate()}</div>
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
                                                            <div className={styles.appointmentTitle}>{appointment.title}</div>
                                                            <div className={styles.appointmentTime}>{appointment.time}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 오늘 시간 표시선 */}
                                    {dayIndex === currentDayIndex && currentTimePosition !== null && (
                                        <div
                                            className={styles.currentTimeLine}
                                            style={{
                                                position: 'absolute',
                                                top: `${120 + currentTimePosition}px`,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                backgroundColor: 'red', // 원하는 색
                                                zIndex: 10
                                            }}
                                        />
                                    )}
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

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>제목 *</label>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>시작 시간 *</label>
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>소요 시간</label>
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>메모</label>
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

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
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