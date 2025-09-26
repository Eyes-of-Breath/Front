import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styles from '../components/Login.module.css';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ChangePassword() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${SERVER_URL}/member/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ currentPassword: password, newPassword }),
            });

            if (!response.ok) {
                let message = '비밀번호 변경에 실패했습니다.';
                setError(message);
                return;
            }
            
            navigate("/");

        } catch (err) {
            setError('서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.body.style.backgroundColor = '#EEF2FF';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className={styles.login}>
            <Helmet>
                <title>비밀번호 변경하기</title>
            </Helmet>
            <form className={styles.login_form} onSubmit={e => { e.preventDefault(); handleChange(); }}>
                <h1 className={styles.title}>비밀번호 변경하기</h1>
                <label htmlFor='email'>기존 비밀번호:</label>
                <input
                    type='password'
                    name='password'
                    placeholder='기존 비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor='password'>새 비밀번호:</label>
                <input
                    type='password'
                    name='newPassword'
                    placeholder='새 비밀번호를 입력하세요'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                {error && (
                    <p style={{ color: 'red', textAlign: 'center', margin: 0, marginBottom: '8px' }}>
                        {error.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                )}
                <button type='submit' disabled={isLoading}>
                    {isLoading ? '변경 중...' : '변경하기'}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
