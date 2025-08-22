import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

const newsAPI = {
    async getAllNews() {
        const response = await fetch(`${API_BASE}/news`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    },

    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE}/news/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
};

function Home3() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // 서버 연결 확인
            const isConnected = await newsAPI.checkHealth();
            setConnected(isConnected);
            
            if (!isConnected) {
                throw new Error('Spring Boot 서버 연결 실패');
            }
            
            // 뉴스 데이터 가져오기
            const newsData = await newsAPI.getAllNews();
            setNews(newsData || []);
            
        } catch (err) {
            setError(err.message);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = () => {
        loadData();
    };

    const openLink = (url) => {
        if (url && url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            alert('링크가 없습니다');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>의료 뉴스 (개발용)</h1>
            
            {/* 상태 정보 */}
            <div style={{ 
                background: '#f5f5f5', 
                padding: '15px', 
                marginBottom: '20px',
                border: '1px solid #ddd'
            }}>
                <h3>연결 상태</h3>
                <p>서버 연결: {connected ? '✅ 성공' : '❌ 실패'}</p>
                <p>뉴스 개수: {news.length}개</p>
                <p>상태: {loading ? '로딩 중...' : error ? `에러: ${error}` : '정상'}</p>
                <button onClick={handleRefresh} disabled={loading}>
                    {loading ? '로딩 중...' : '새로고침'}
                </button>
            </div>

            {/* 뉴스 목록 */}
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
            ) : news.length === 0 ? (
                <div style={{ padding: '10px', background: '#fff3cd' }}>
                    <h3>데이터 없음</h3>
                    <p>뉴스 테이블에 데이터가 없습니다.</p>
                    <p>NewsScheduler가 1시간마다 자동으로 뉴스를 수집합니다.</p>
                </div>
            ) : (
                <div>
                    <h3>뉴스 목록 ({news.length}개)</h3>
                    {news.map((article, index) => (
                        <div key={article.newsId || index} style={{ 
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '10px',
                            background: 'white'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>
                                {article.title || '제목 없음'}
                            </h4>
                            <p style={{ 
                                color: '#666', 
                                fontSize: '14px',
                                margin: '5px 0'
                            }}>
                                {article.summary || '요약 없음'}
                            </p>
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#999',
                                marginTop: '10px'
                            }}>
                                <span>발행: {article.publishedAt || 'N/A'}</span>
                                <span style={{ marginLeft: '15px' }}>
                                    수집: {article.crawledAt || 'N/A'}
                                </span>
                                <span style={{ marginLeft: '15px' }}>
                                    ID: {article.newsId}
                                </span>
                            </div>
                            <button 
                                onClick={() => openLink(article.newsUrl)}
                                style={{ 
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                원문 보기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home3;