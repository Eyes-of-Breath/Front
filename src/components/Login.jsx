import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigateToSignup = () => {
        navigate("/signup");
    }

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${SERVER_URL}/auth/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                let message = '로그인에 실패했습니다.\n이메일과 비밀번호를 확인하세요.';
                if (response.status === 401) {
                    message = '이메일 또는 비밀번호가 올바르지 않습니다.';
                } else if (response.status === 404) {
                    message = '해당 이메일로 가입된 계정이 없습니다.';
                }
                setError(message);
                return;
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('memberId', data.memberId);
            localStorage.setItem('nickname', data.nickname);
            localStorage.setItem('email', email);

            console.log(data);

            navigate("/dashboard");

        } catch (err) {
            console.error('Login error:', err);
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
                <title>로그인</title>
            </Helmet>
            <form className={styles.login_form} onSubmit={e => { e.preventDefault(); handleLogin(); }}>
                <h1 className={styles.title}>로그인</h1>
                <label htmlFor='email'>이메일</label>
                <input
                    type='email'
                    name='email'
                    placeholder='이메일을 입력하세요'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor='password'>비밀번호</label>
                <input
                    type='password'
                    name='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
                <p>
                    계정이 없으신가요?
                    <b onClick={navigateToSignup} style={{ cursor: 'pointer' }}> 회원가입</b>
                </p>
            </form>
        </div>
    );
}

export default Login;
