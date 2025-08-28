import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import styles from './PatientAll.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function PatientAll() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const accessToken = localStorage.getItem('accessToken');
    const memberId = Number(localStorage.getItem('memberId'));

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/patients/with-xrays`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("환자 목록 불러오기 실패");
                }

                const data = await response.json();
                setPatients(data);
                console.log(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleDelete = async (patientId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await fetch(`${SERVER_URL}/patients/${patientId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            setPatients((prev) => prev.filter((p) => p.patientId !== patientId));
            alert("삭제 완료!");
        } catch (err) {
            console.error("삭제 오류:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                전체 환자 목록
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>환자 목록을 불러오고 있습니다.</p>
                </div>
            ) : error ? (
                <div className={styles.loadingContainer}>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <div className={styles.leftSection}>
                        <div className={styles.searchSection}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.patientTable}>
                                    <thead>
                                        <tr>
                                            <th>환자 ID</th>
                                            <th>이름</th>
                                            <th>생년월일</th>
                                            <th>성별</th>
                                            <th>환자 Code</th>
                                            <th>키</th>
                                            <th>몸무게</th>
                                            <th>혈액형</th>
                                            <th>보고서 수</th>
                                            <th>환자 삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients
                                            .filter(p => (p.xrayImages || []).some(img => img.diagnosisResult !== null))
                                            .map((p) => (
                                                <tr key={p.patientId}>
                                                    <td>{p.patientId}</td>
                                                    <td>{p.name}</td>
                                                    <td>{p.birthDate}</td>
                                                    <td>{p.gender}</td>
                                                    <td>{p.patientCode}</td>
                                                    <td>{p.height}</td>
                                                    <td>{p.weight}</td>
                                                    <td>{p.bloodType}</td>
                                                    <td>{p.xrayImages.filter(img => img.diagnosisResult !== null).length}</td>
                                                    <td>
                                                        {p.memberId === memberId && (
                                                            <button onClick={() => handleDelete(p.patientId)}>
                                                                <Trash size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientAll;
