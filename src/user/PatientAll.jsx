import React, { useEffect, useState } from "react";
import { Trash, ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import styles from './PatientAll.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function PatientAll() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
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
                const patientsWithReports = data.filter(p => 
                    (p.xrayImages || []).some(img => img.diagnosisResult !== null)
                );
                setPatients(patientsWithReports);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...patients].sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];

            if (key === 'xrayImages') {
                aVal = a.xrayImages.filter(img => img.diagnosisResult !== null).length;
                bVal = b.xrayImages.filter(img => img.diagnosisResult !== null).length;
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setPatients(sorted);
    };

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

            setPatients(prev => prev.filter(p => p.patientId !== patientId));
            alert("삭제 완료!");
        } catch (err) {
            console.error("삭제 오류:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) {
            return <ChevronsUpDown size={14} className={styles.sortIcon} />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp size={14} className={styles.sortIconActive} />
            : <ChevronDown size={14} className={styles.sortIconActive} />;
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.greeting}>
                총 {patients.length}명의 환자가 등록되어 있습니다 👀
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingWrapper}>
                        <Loader2 size={80} className={styles.loadingIcon} />
                        <div className={styles.loadingText}>
                            <h3>환자 목록 불러오는 중</h3>
                            <p>잠시만 기다려주세요...</p>
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className={styles.loadingContainer}>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            ) : (
                <div className={styles.scrollWrapper}>
                    <div className={styles.tableContainer}>
                        <table className={styles.patientTable}>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('patientId')}>
                                        환자 ID <SortIcon column="patientId" />
                                    </th>
                                    <th onClick={() => handleSort('name')}>
                                        이름 <SortIcon column="name" />
                                    </th>
                                    <th onClick={() => handleSort('birthDate')}>
                                        생년월일 <SortIcon column="birthDate" />
                                    </th>
                                    <th onClick={() => handleSort('gender')}>
                                        성별 <SortIcon column="gender" />
                                    </th>
                                    <th onClick={() => handleSort('patientCode')}>
                                        환자 Code <SortIcon column="patientCode" />
                                    </th>
                                    <th onClick={() => handleSort('height')}>
                                        키 <SortIcon column="height" />
                                    </th>
                                    <th onClick={() => handleSort('weight')}>
                                        몸무게 <SortIcon column="weight" />
                                    </th>
                                    <th onClick={() => handleSort('bloodType')}>
                                        혈액형 <SortIcon column="bloodType" />
                                    </th>
                                    <th onClick={() => handleSort('xrayImages')}>
                                        보고서 수 <SortIcon column="xrayImages" />
                                    </th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className={styles.emptyMessage}>
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((p) => (
                                        <tr key={p.patientId}>
                                            <td>{p.patientId}</td>
                                            <td className={styles.nameCell}>{p.name}</td>
                                            <td>{p.birthDate}</td>
                                            <td>
                                                <span className={styles.genderBadge}>
                                                    {p.gender}
                                                </span>
                                            </td>
                                            <td className={styles.codeCell}>{p.patientCode}</td>
                                            <td>{p.height} cm</td>
                                            <td>{p.weight} kg</td>
                                            <td>{p.bloodType}</td>
                                            <td>
                                                <span className={styles.reportBadge}>
                                                    {p.xrayImages.filter(img => img.diagnosisResult !== null).length}
                                                </span>
                                            </td>
                                            <td>
                                                {p.memberId === memberId && (
                                                    <button 
                                                        onClick={() => handleDelete(p.patientId)}
                                                        className={styles.deleteButton}
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientAll;