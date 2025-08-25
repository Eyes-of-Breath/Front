import React, { useEffect, useState } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const accessToken = localStorage.getItem('accessToken');

function PatientAll() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div
                style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#1a1a1a',
                    margin: '0 0 1rem 0',
                    paddingTop: '2rem',
                    lineHeight: '1.6',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    paddingLeft: '0.5rem',
                    textAlign: 'left'
                }}
            >
                전체 환자 목록
            </div>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Birth Date</th>
                        <th>Gender</th>
                        <th>Patient Code</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((p) => (
                        <tr key={p.patientId}>
                            <td>{p.patientId}</td>
                            <td>{p.name}</td>
                            <td>{p.birthDate}</td>
                            <td>{p.gender}</td>
                            <td>{p.patientCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PatientAll;
