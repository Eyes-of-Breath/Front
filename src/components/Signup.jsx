import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                nickname: nickname,
                createdAt: new Date(),
            });

            // setSuccess('회원가입이 완료되었습니다!');
            setError('');
            setNickname('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
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
                    message = '회원가입 중 오류가 발생했습니다.';
            }

            setError(message);
            setSuccess('');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
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

                <label htmlFor='nickname'>닉네임</label>
                <input
                    type='text'
                    name='nickname'
                    placeholder='닉네임을 입력하세요'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />

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

                <label htmlFor='confirmPassword'>비밀번호 확인</label>
                <input
                    type='password'
                    name='confirmPassword'
                    placeholder='비밀번호를 다시 입력하세요'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: 'red', textAlign: 'center', margin: 0, marginBottom: '8px' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                <button type='submit'>회원가입</button>
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
