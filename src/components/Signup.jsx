import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [inputVerificationCode, setInputVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerifying, setIsCodeVerifying] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    // 카운트다운 타이머
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // 인증번호 전송
    const handleSendVerificationCode = async () => {
        if (!email) {
            setError('이메일을 먼저 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setError('');

        try {
            const checkResponse = await fetch(`${SERVER_URL}/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const checkData = await checkResponse.json();

            if (!checkResponse.ok || checkData.exists) {
                setError('이미 가입된 이메일입니다.');
                return;
            }

            setIsSendingCode(true);

            const response = await fetch(`${SERVER_URL}/auth/send-certification-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || '이메일 발송 실패');
                return;
            }

            setIsCodeSent(true);
            setCountdown(300);
            setSuccess(`인증번호가 ${email}로 발송되었습니다.`);

        } catch (err) {
            setError('인증번호 발송 중 오류가 발생했습니다.');
            console.error('Error sending verification code:', err);
        } finally {
            setIsSendingCode(false);
        }
    };

    // 인증번호 재전송
    const handleResendCode = () => {
        setInputVerificationCode('');
        setIsEmailVerified(false);
        handleSendVerificationCode();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password.length < 8) {
            setError('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/auth/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    nickname: name,
                    certificationNumber: inputVerificationCode, // 사용자가 입력한 인증번호
                }),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error("회원가입 요청 실패");
            }

            const data = await response.json();
            console.log("회원가입 결과:", data);

            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setInputVerificationCode('');
            setIsEmailVerified(false);
            setIsCodeSent(false);
            setShowModal(true);

        } catch (err) {
            let message = '';
            switch (err.code) {
                case 'auth/email-already-in-use':
                    message = '이미 사용 중인 이메일입니다.';
                    break;
                case 'auth/invalid-email':
                    message = '유효하지 않은 이메일 주소입니다.';
                    break;
                case 'auth/weak-password':
                    message = '비밀번호는 6자 이상이어야 합니다.';
                    break;
                case 'auth/missing-password':
                    message = '비밀번호를 입력해주세요.';
                    break;
                default:
                    message = '인증번호가 일치하지 않습니다.';
            }
            setError(message);
            setSuccess('');
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

                <label htmlFor='name'>이름</label>
                <input
                    type='text'
                    name='name'
                    id='name'
                    placeholder='이름을 입력하세요'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor='email'>이메일</label>
                <div className={styles.emailContainer}>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='이메일을 입력하세요'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailVerified(false);
                            setIsCodeSent(false);
                            setSuccess('');
                        }}
                        required
                        disabled={isEmailVerified}
                        className={isEmailVerified ? styles.verifiedInput : ''}
                    />
                    <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={isSendingCode || isEmailVerified}
                        className={`${styles.verificationButton} ${isEmailVerified ? styles.verified : ''
                            }`}
                        style={{ transform: 'translateY(0px)' }}
                    >
                        {isEmailVerified ? '인증완료' : isSendingCode ? '발송중...' : '인증번호'}
                    </button>
                </div>

                {isCodeSent && !isEmailVerified && (
                    <>
                        <label htmlFor='verificationCode'>
                            인증번호
                            {countdown > 0 && (
                                <span className={styles.countdown}>
                                    ({formatTime(countdown)})
                                </span>
                            )}
                            {success && (
                                <span className={styles.successMessage}>
                                    - 인증번호가 발송되었습니다
                                </span>
                            )}
                        </label>
                        <div className={styles.verificationContainer}>
                            <input
                                type='text'
                                name='verificationCode'
                                id='verificationCode'
                                placeholder='인증번호 6자리를 입력하세요'
                                value={inputVerificationCode}
                                onChange={(e) => setInputVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                            />
                            {/* <button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={isCodeVerifying || countdown <= 0 || inputVerificationCode.length !== 6}
                                className={styles.verifyButton}
                                style={{
                                    transform: 'translateY(0px) !important',
                                    position: 'relative',
                                    top: '0px'
                                }}
                            >
                                {isCodeVerifying ? '확인중...' : '확인'}
                            </button> */}
                        </div>
                        {countdown <= 0 && (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className={styles.resendButton}
                            >
                                인증번호 재전송
                            </button>
                        )}
                    </>
                )}

                <label htmlFor='password'>비밀번호</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor='confirmPassword'>비밀번호 확인</label>
                <input
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    placeholder='비밀번호를 다시 입력하세요'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && !success && <p style={{ color: 'red', textAlign: 'center', margin: 0, marginBottom: '15px' }}>{error}</p>}

                <button type="submit">
                    가입하기
                </button>
            </form>

            {showModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <p>회원가입이 완료되었습니다!</p>
                        <button onClick={handleCloseModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Signup;