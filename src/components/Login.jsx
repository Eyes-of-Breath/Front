import React, { useEffect, } from 'react';
import './Login.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const navigateToSignup = () => {
        navigate("/signup");
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#EEF2FF';

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className='parent'>
            <Helmet>
                <title>로그인</title>
            </Helmet>
            <form className='login-form'>
                <h1 className='title'>로그인</h1>
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
                />
                <button type='submit'>로그인</button>
                <p>계정이 없으신가요?
                    <b onClick={navigateToSignup} style={{ cursor: 'pointer' }}> 회원가입</b>
                </p>
            </form>
        </div>
    );
}

export default Login;