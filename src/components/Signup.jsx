import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styles from './Signup.module.css';

function Signup() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
        } else {
            setError('');
        }
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#EEF2FF';

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className={styles.signup}>
            <Helmet>
                <title>회원가입</title>
            </Helmet>
            <form className={styles.login_form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>회원가입</h1>
                <label htmlFor='nickname'>닉네임</label>
                <input
                    type='text'
                    name='text'
                    placeholder='닉네임을 입력하세요'
                />
                <label htmlFor='email'>이메일</label>
                <input
                    type='email'
                    name='email'
                    placeholder='이메일을 입력하세요'
                />
                <label htmlFor='password'>비밀번호</label>
                <input
                    type='password'
                    name='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor='password'>비밀번호 확인</label>
                <input
                    type='password'
                    name='password'
                    placeholder='비밀번호를 다시 입력하세요'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: 0, marginBottom: 5 }}>{error}</p>}
                <button type='submit'>회원가입</button>
            </form>
        </div>
    );
}

export default Signup;