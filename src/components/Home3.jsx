import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
// CSS 모듈 스타일 객체
const styles = {
    container: {
        fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '0'
    },
    parent: {
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh'
    },
    column1: {
        display: 'flex',
        width: '25vw',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '5vh', // 여백 줄임
        marginLeft: '3vw',
        marginRight: '3vw'
    },
    column2: {
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: '50px',
        paddingTop: '11vh', // 여백 줄임
        paddingLeft: '4vw',
        paddingRight: '3vw'
    },
    title: {
        margin: 0,
        fontSize: '40px',
        fontWeight: 600,
        color: '#1F2937'
    },
    subtitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 300,
        color: '#6B7280',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        opacity: 0.8
    },
    newsRow: {
        display: 'flex',
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'all 0.6s ease',
        marginBottom: '40px'
    },
    newsRowExtraGap: {
        marginBottom: '100px' // 2~3번째 기사 사이 큰 여백
    },
    newsRowVisible: {
        opacity: 1,
        transform: 'translateY(0)'
    },
    imageWrapper: {
        overflow: 'hidden',
        borderRadius: '8px',
        width: '250px',
        height: '250px',
        minWidth: '250px',
        maxWidth: '250px',
        minHeight: '250px',
        maxHeight: '250px',
        flexShrink: 0
    },
    image: {
        width: '250px',
        height: '250px',
        objectFit: 'cover',
        objectPosition: 'center',
        borderRadius: '8px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        minWidth: '250px',
        maxWidth: '250px',
        minHeight: '250px',
        maxHeight: '250px'
    },
    imageHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    newsText: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '4vw',
        marginRight: '3vw',
        justifyContent: 'center'
    },
    date: {
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: '#6B7280',
        fontWeight: 500
    },
    newsTitle: {
        margin: 0,
        fontSize: '22px',
        fontWeight: 600,
        color: '#1F2937',
        lineHeight: 1.4,
        marginBottom: '12px'
    },
    newsContent: {
        margin: '0 0 20px 0',
        fontSize: '16px',
        color: '#4B5563',
        lineHeight: 1.6
    },
    button: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '120px',
        height: '40px',
        backgroundColor: '#FFFFFF',
        borderRadius: '0',
        border: '2px solid #E5E7EB',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        marginTop: '1vh',
        transition: 'all 0.3s ease',
        color: '#374151',
        fontFamily: 'inherit'
    },
    buttonHover: {
        borderColor: '#3B82F6',
        color: '#3B82F6',
        transform: 'translateY(-1px)'
    }
};

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const CACHE_EXPIRATION_TIME = 3600000;

// 뉴스 데이터 통신을 위한 API 객체
const newsAPI = {
    async getAllNews() {
        const response = await fetch(`${SERVER_URL}/news`);
        if (!response.ok) {
            throw new Error(`Spring Boot 서버 연결 실패 (HTTP ${response.status})`);
        }
        return await response.json();
    },
};

function Home3() {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [visibleRows, setVisibleRows] = useState([]);

    // 기존 API 호출 및 캐싱 로직 유지
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const cachedNews = localStorage.getItem('newsCache');
            const cachedTimestamp = localStorage.getItem('newsCacheTimestamp');
            if (cachedNews && cachedTimestamp) {
                const isCacheValid = (new Date().getTime() - cachedTimestamp) < CACHE_EXPIRATION_TIME;
                if (isCacheValid) {
                    setNewsData(JSON.parse(cachedNews));
                    setLoading(false);
                    return;
                }
            }
            const newsArr = await newsAPI.getAllNews();
            setNewsData(Array.isArray(newsArr) ? newsArr : []);
            localStorage.setItem('newsCache', JSON.stringify(newsArr));
            localStorage.setItem('newsCacheTimestamp', new Date().getTime());
        } catch (err) {
            setError(err.message);
            setNewsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 애니메이션 효과: 뉴스 행이 순차적으로 보이도록
    useEffect(() => {
        if (!loading && newsData.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                setVisibleRows(prev => {
                    if (prev.length < newsData.length) {
                        return [...prev, prev.length];
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
                i++;
            }, 120);
            return () => clearInterval(interval);
        }
    }, [loading, newsData]);

    const openLink = (url) => {
        if (url && url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            alert('링크가 없습니다');
        }
    };

    // 이미지 파일 경로 배열 (article1.png, article2.png 번갈아)
    const newsImages = [
        require('../assets/article1.png'),
        require('../assets/article2.png')
    ];

    return (
        <div style={styles.container}>
            <div style={styles.parent}>
                {/* 왼쪽 열 - 타이틀 */}
                <div style={styles.column1}>
                    <h1 style={styles.title}>주요 기사</h1>
                    <h2 style={styles.subtitle}>LATEST NEWS</h2>
                </div>
                {/* 오른쪽 열 - 뉴스 내용 */}
                <div style={styles.column2}>
                    {loading ? (
                        <p>데이터 로딩 중...</p>
                    ) : error ? (
                        <div style={{ color: 'red', padding: '10px', background: '#ffe6e6' }}>
                            <h3>오류 발생</h3>
                            <p>{error}</p>
                            <p><strong>확인사항:</strong></p>
                            <ul>
                                <li>Spring Boot 서버가 localhost:8080에서 실행 중인가?</li>
                                <li>MySQL이 실행 중이고 연결되어 있는가?</li>
                                <li>/api/news 엔드포인트가 존재하는가?</li>
                            </ul>
                        </div>
                    ) : newsData.length === 0 ? (
                        <div style={{ padding: '10px', background: '#fff3cd' }}>
                            <h3>데이터 없음</h3>
                            <p>뉴스 테이블에 데이터가 없습니다.</p>
                            <p>NewsScheduler가 1시간마다 자동으로 뉴스를 수집합니다.</p>
                        </div>
                    ) : (
                        newsData.slice(0, 2).map((news, index) => {
                            return (
                                <div className="scene-content" key={news.id || news.newsId || index}>
                                    <div
                                        style={{
                                            ...styles.newsRow,
                                            ...(visibleRows.includes(index) ? styles.newsRowVisible : {}),
                                        }}
                                    >
                                        {/* 이미지 */}
                                        <div style={styles.imageWrapper}>
                                            <img
                                                src={newsImages[index % newsImages.length]}
                                                alt="뉴스 이미지"
                                                style={styles.image}
                                            />
                                        </div>
                                        {/* 텍스트 내용 */}
                                        <div style={styles.newsText}>
                                            <p style={styles.date}>{news.date || news.publishedAt || 'N/A'}</p>
                                            <h3 style={styles.newsTitle}>{news.title}</h3>
                                            <p style={styles.newsContent}>{news.content || news.summary}</p>
                                            <button
                                                style={{
                                                    ...styles.button,
                                                    ...(hoveredButton === index ? styles.buttonHover : {}),
                                                }}
                                                onMouseEnter={() => setHoveredButton(index)}
                                                onMouseLeave={() => setHoveredButton(null)}
                                                onClick={() => openLink(news.newsUrl)}
                                            >
                                                더 보기
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home3;
