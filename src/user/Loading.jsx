import React, { useEffect, useRef } from 'react'; // 1. useRef import 추가
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import styles from './Loading.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const accessToken = localStorage.getItem('accessToken');

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();

    // 2. useEffect가 이미 실행되었는지 확인하기 위한 플래그
    const effectRan = useRef(false);

    const { patientInfo, uploadedFile } = location.state || {};

    useEffect(() => {
        // 3. Strict Mode에서 두 번째 렌더링일 경우 API 호출을 막음
        if (effectRan.current === true) {
            return;
        }

        if (!patientInfo || !uploadedFile) {
            navigate('/analysis');
            return;
        }

        const startAnalysis = async () => {
            try {
                if (!accessToken) {
                    alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                    navigate('/login');
                    return;
                }

                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('name', patientInfo.name);
                formData.append('patientCode', patientInfo.patientCode);
                formData.append('birthDate', patientInfo.birthDate);
                formData.append('gender', patientInfo.gender === '남성' ? 'M' : 'F');
                formData.append('bloodType', patientInfo.bloodType);
                formData.append('height', patientInfo.height);
                formData.append('weight', patientInfo.weight);

                let response = await fetch(`${SERVER_URL}/diagnosis/start/new-patient`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: formData
                });

                // new-patient가 실패하면 existing-patient로 재시도
                if (!response.ok) {
                    console.warn("new-patient 요청 실패, patientId를 조회합니다");
                    response = await fetch(`${SERVER_URL}/patients/code/${encodeURIComponent(patientInfo.patientCode)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },

                    })

                    const data = await response.json();
                    const patientId = data.patientId;

                    const existingPatientForm = new FormData();
                    existingPatientForm.append('file', uploadedFile);
                    existingPatientForm.append('patientId', patientId);

                    response = await fetch(`${SERVER_URL}/diagnosis/start/existing-patient`, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                        },
                        body: existingPatientForm,
                    });
                }

                const result = await response.json();
                console.log('백엔드 실제 응답:', result);

                navigate('/result', {
                    state: { patient: result }
                });

            } catch (error) {
                console.error("AI 분석 요청 실패:", error);
                if (error.response && error.response.status === 401) {
                    alert("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
                    navigate('/login');
                } else {
                    alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
                    navigate(-1);
                }
            }
        };

        startAnalysis();

        // 4. useEffect가 처음 실행된 후 플래그를 true로 설정
        return () => {
            effectRan.current = true;
        };
        // 5. 의존성 배열을 비워 최초 한 번만 실행되도록 보장
    }, []);

    if (!patientInfo || !uploadedFile) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.loadingWrapper}>
                <div className={styles.iconContainer}>
                    <Sparkles size={64} className={styles.animatedIcon} />
                </div>
                <h1 className={styles.title}>AI 분석 진행 중</h1>
                <p className={styles.message}>AI가 열심히 분석 중이에요. 잠시만 기다려주세요.</p>
                <div className={styles.simpleSpinner}></div>
            </div>
        </div>
    );
}

export default Loading;