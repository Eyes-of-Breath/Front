import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';  // firebase.js 위치에 맞게 경로 조정

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigateToSignup = () => {
        navigate("/signup");
    }

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError('');
            navigate("/dashboard");
        } catch (error) {
            setError('로그인에 실패했습니다.\n이메일과 비밀번호를 확인하세요.');
        }
    }

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
                <button type='submit'>로그인</button>
                <p>
                    계정이 없으신가요?
                    <b onClick={navigateToSignup} style={{ cursor: 'pointer' }}> 회원가입</b>
                </p>
            </form>
        </div>
    );
}

export default Login;
