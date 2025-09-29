import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Trash2,
    Check,
    X,
    ChevronLeft,
    ChevronRight
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

    const [appointments, setAppointments] = useState([]);

    const [formData, setFormData] = useState({
        eventid: '',
        title: '',
        startTime: '',
        endTime: '',
        memo: ''
    });

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    const weekDates = useMemo(() => {
        const startOfWeek = new Date(currentWeek);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek);
            weekDate.setDate(startOfWeek.getDate() + i);
            weekDate.setHours(0, 0, 0, 0);
            dates.push(weekDate);
        }
        return dates;
    }, [currentWeek]);

    const currentDayIndex = useMemo(() => {
        const today = new Date();
        for (let i = 0; i < weekDates.length; i++) {
            if (today.toDateString() === weekDates[i].toDateString()) return i;
        }
        return null;
    }, [weekDates]);

    const toLocalDatetimeInputValue = (d) => {
        if (!d) return '';
        const date = new Date(d);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const local = new Date(date.getTime() - tzOffset);
        return local.toISOString().slice(0, 16);
    };

    const fromDatetimeLocalToISOString = (localValue) => {
        if (!localValue) return '';
        const local = new Date(localValue);
        return new Date(local.getTime() - (local.getTimezoneOffset() * 60000)).toISOString();
    };

    const getToday = () => new Date().toISOString().split("T")[0];

    const fetchTodayTodos = async () => {
        const today = getToday();
        try {
            const res = await fetch(`${SERVER_URL}/schedule/todos?date=${today}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) throw new Error('할 일 조회 실패');
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            console.error('할 일 조회 오류:', err);
        }
    };

    useEffect(() => {
        fetchTodayTodos();
    }, []);

    const addTodo = async () => {
        if (!newTodo.trim()) return alert('할 일을 입력하세요.');
        const today = getToday();
        try {
            const res = await fetch(`${SERVER_URL}/schedule/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    content: newTodo,
                    targetDate: today
                })
            });
            if (!res.ok) throw new Error('할 일 등록 실패');
            setNewTodo('');
            await fetchTodayTodos();
        } catch (err) {
            console.error('할 일 등록 오류:', err);
            alert('할 일 등록에 실패했습니다.');
        }
    };

    const toggleTodo = async (todoId) => {
        setLoadingTodos(prev => [...prev, todoId]);
        try {
            const res = await fetch(`${SERVER_URL}/schedule/todos/${todoId}/toggle`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) throw new Error('토글 실패');
            setTodos(prev => prev.map(t => t.todoId === todoId ? { ...t, completed: !t.completed } : t));
        } catch (err) {
            console.error('토글 오류:', err);
            alert('할 일 상태 변경에 실패했습니다.');
        } finally {
            setLoadingTodos(prev => prev.filter(id => id !== todoId));
        }
    };

    const deleteTodo = async (todoId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`${SERVER_URL}/schedule/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) throw new Error('삭제 실패');
            setTodos(prev => prev.filter(t => t.todoId !== todoId));
        } catch (err) {
            console.error('삭제 오류:', err);
            alert('삭제에 실패했습니다.');
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/schedule/events`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) throw new Error('일정 조회 실패');
            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            console.error('일정 조회 오류:', err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        fetchWeekEvents();
    }, [weekDates]);

    const fetchWeekEvents = async () => {
        if (!weekDates || weekDates.length === 0) return;

        const startDate = weekDates[0].toISOString().split("T")[0];
        const endDate = weekDates[6].toISOString().split("T")[0];
        const myMemberId = Number(localStorage.getItem('memberId'));

        try {
            const res = await fetch(`${SERVER_URL}/schedule/events?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!res.ok) throw new Error("API 요청 실패");
            const data = await res.json();

            const filtered = data.filter(event => event.memberId === myMemberId);

            setAppointments(
                filtered.map(event => ({
                    eventId: event.eventId,
                    day: new Date(event.startTime).getDay() === 0 ? 6 : new Date(event.startTime).getDay() - 1,
                    time: `${new Date(event.startTime).getHours()}`.padStart(2, '0') + ':' + `${new Date(event.startTime).getMinutes()}`.padStart(2, '0'),
                    duration: (new Date(event.endTime) - new Date(event.startTime)) / (1000 * 60 * 60),
                    title: event.title,
                    description: event.memo,
                    startTime: event.startTime,
                    endTime: event.endTime
                }))
            );
        } catch (err) {
            console.error("주간 일정 조회 실패", err);
        }
    };

    const changeWeek = (direction) => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + direction * 7);
        setCurrentWeek(newWeek);
    };

    const handleTimeSlotClick = (dayIndex, timeSlot) => {
        const date = weekDates[dayIndex];
        const [hour, minute] = timeSlot.split(":").map(Number);
        const start = new Date(date);
        start.setHours(hour, minute, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        setFormData({
            title: '',
            startTime: toLocalDatetimeInputValue(start),
            endTime: toLocalDatetimeInputValue(end),
            memo: ''
        });
        setSelectedSlot({ day: dayIndex, time: timeSlot });
        setEditingEvent(null);
        setShowModal(true);
    };

    const handleAppointmentClick = (appointment, e) => {
        e.stopPropagation();
        setEditingEvent(appointment);
        console.log(appointment);
        setFormData({
            eventId: appointment.eventId,
            title: appointment.title || '',
            startTime: toLocalDatetimeInputValue(appointment.startTime),
            endTime: toLocalDatetimeInputValue(appointment.endTime),
            memo: appointment.memo || appointment.description || ''
        });
        setShowModal(true);
    };

    const getAppointmentsAt = (dayIndex, timeSlot) => {
        const date = weekDates[dayIndex];
        const [hour, minute] = timeSlot.split(":").map(Number);
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);
        const slotKey = toLocalDatetimeInputValue(slotStart);
        return appointments.filter(apt => {
            const aptLocalStart = toLocalDatetimeInputValue(apt.startTime);
            return aptLocalStart === slotKey;
        });
    };

    const handleSubmit = async (e, eventId) => {
        e.preventDefault();
        console.log(eventId);

        const startISO = fromDatetimeLocalToISOString(formData.startTime);
        const endISO = fromDatetimeLocalToISOString(formData.endTime);
        if (!startISO || !endISO) return alert('시작/완료 시간을 모두 입력해주세요.');
        if (new Date(startISO) >= new Date(endISO)) return alert('완료 시간은 시작 시간 이후여야 합니다.');

        const body = {
            title: formData.title,
            startTime: startISO,
            endTime: endISO,
            memo: formData.memo
        };

        try {
            if (editingEvent) {
                const res = await fetch(`${SERVER_URL}/schedule/events/${eventId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body)
                });
                if (!res.ok) throw new Error('수정 실패');
            } else {
                const res = await fetch(`${SERVER_URL}/schedule/events`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body)
                });
                if (!res.ok) throw new Error('추가 실패');
            }

            await fetchAppointments();
            await fetchWeekEvents();
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', startTime: '', endTime: '', memo: '' });
            setSelectedSlot(null);
            alert('저장 완료되었습니다!');
        } catch (err) {
            console.error('일정 저장 오류:', err);
            alert('일정 저장에 실패했습니다.');
        }
    };

    const handleDeleteAppointment = async (eventId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`${SERVER_URL}/schedule/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (!res.ok) throw new Error('삭제 실패');
            await fetchAppointments();
            await fetchWeekEvents();
            setShowModal(false);
            setEditingEvent(null);
            alert('삭제 완료되었습니다!');
        } catch (err) {
            console.error('일정 삭제 오류:', err);
            alert('삭제에 실패했습니다.');
        }
    };


    const slotHeight = 60;
    const slotGap = 16;

    const getDurationHeightPx = (startISO, endISO) => {
        const s = new Date(startISO);
        const e = new Date(endISO);
        const durationHours = (e - s) / (1000 * 60 * 60);
        const totalHeight = durationHours * slotHeight;
        const adjustedHeight = totalHeight - slotGap;
        return Math.max(adjustedHeight, 20);
    };

    const completedTodos = todos.filter(t => t.completed).length;
    const totalTodos = todos.length;

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.leftSidebar}>
                    <h1 className={styles.greeting}>오늘의 할 일</h1>

                    <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                            <span className={styles.progressText}>진행률</span>
                            <span className={styles.progressNumbers}>{completedTodos}/{totalTodos}</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
                            />
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
                                    if (e.key === 'Enter') addTodo();
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

                    <div className={styles.todoList}>
                        {todos.length === 0 ? (
                            <div style={{ padding: '1rem', color: '#6b7280' }}>할 일이 없습니다.</div>
                        ) : (
                            todos.map(todo => (
                                <div key={todo.todoId} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
                                    <button
                                        className={`${styles.todoCheckbox} ${todo.completed ? styles.checked : ''}`}
                                        onClick={() => toggleTodo(todo.todoId)}
                                        disabled={loadingTodos.includes(todo.todoId)}
                                        style={{ color: '#6b7280' }}
                                    >
                                        <Check size={12} style={{ opacity: todo.completed ? 1 : 0 }} />
                                    </button>

                                    <div className={styles.todoContent}>
                                        <div className={styles.todoDetails}>{todo.content}</div>
                                        <div className={styles.todoActions}>
                                            <button onClick={() => deleteTodo(todo.todoId)} className={styles.todoDeleteBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className={styles.calendarSection}>
                    <div className={styles.weekCalendar}>
                        <div className={styles.calendarHeader}>
                            <button className={`${styles.navButton} ${styles.prev}`} onClick={() => changeWeek(-1)}>
                                <ChevronLeft size={18} />
                                <span>이전 주</span>
                            </button>
                            <h2 className={styles.weekTitle}>
                                {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 ~ {weekDates[6].getDate()}일
                            </h2>
                            <button className={`${styles.navButton} ${styles.next}`} onClick={() => changeWeek(1)}>
                                <span>다음 주</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className={styles.calendarGrid}>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeHeader}>시간</div>
                                {timeSlots.map(time => <div key={time} className={styles.timeSlot}>{time}</div>)}
                            </div>

                            {dayNames.map((dayName, dayIndex) => (
                                <div key={dayIndex} className={styles.dayColumn} style={{ position: 'relative' }}>
                                    <div className={`${styles.dayHeader} ${dayIndex === currentDayIndex ? styles.today : ''}`}>
                                        <div className={styles.dayName}>{dayName}</div>
                                        <div className={styles.dayDate}>{weekDates[dayIndex].getDate()}</div>
                                    </div>

                                    <div className={styles.dayTimeSlots}>
                                        {timeSlots.map(timeSlot => {
                                            const apts = getAppointmentsAt(dayIndex, timeSlot);
                                            return (
                                                <div
                                                    key={timeSlot}
                                                    className={styles.timeCell}
                                                    onClick={() => apts.length === 0 && handleTimeSlotClick(dayIndex, timeSlot)}
                                                >
                                                    {apts.map(apt => (
                                                        <div
                                                            key={apt.eventId}
                                                            className={styles.appointment}
                                                            style={{ height: `${getDurationHeightPx(apt.startTime, apt.endTime)}px` }}
                                                            onClick={(e) => handleAppointmentClick(apt, e)}
                                                        >
                                                            <div className={styles.appointmentTitle}>{apt.title}</div>
                                                            <div className={styles.appointmentTime}>
                                                                {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {dayIndex === currentDayIndex && (() => {
                                        const now = currentTime;
                                        const h = now.getHours();
                                        const m = now.getMinutes();
                                        if (h < 9 || h >= 19) return null;
                                        const relativeHour = h - 9;
                                        const top = 120 + relativeHour * 60 + (m / 60) * 60;
                                        return (
                                            <div
                                                className={styles.currentTimeLine}
                                                style={{
                                                    position: 'absolute',
                                                    top: `${top}px`,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '2px',
                                                    backgroundColor: 'red',
                                                    zIndex: 10
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editingEvent ? '일정 수정' : '새 일정 추가'}</h3>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e, editingEvent?.eventId)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>제목 *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                    style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>시작 시간 *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                        required
                                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>완료 시간 *</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                        required
                                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>메모</label>
                                <textarea
                                    value={formData.memo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                                    placeholder="추가 메모사항을 입력하세요"
                                    style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8, minHeight: 100 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                {editingEvent && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAppointment(editingEvent.eventId)}
                                        style={{
                                            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: 8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} /> 삭제
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #d1d5db',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 8,
                                        cursor: 'pointer'
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg,#87ceeb,#6bb6ff)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Check size={16} /> 저장
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