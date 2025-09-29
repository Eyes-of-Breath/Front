import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, Play, Pause, Stethoscope, Heart, Activity } from 'lucide-react';
import styles from './Home3.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 환경 변수에서 서버 URL 가져오기
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';
const CACHE_EXPIRATION_TIME = 3600000; // 1시간

const newsAPI = {
    async getAllNews() {
        try {
            // 캐시 확인
            const cachedNews = localStorage.getItem('newsCache');
            const cachedTimestamp = localStorage.getItem('newsCacheTimestamp');
            
            if (cachedNews && cachedTimestamp) {
                const isCacheValid = (new Date().getTime() - Number(cachedTimestamp)) < CACHE_EXPIRATION_TIME;
                if (isCacheValid) {
                    console.log('캐시된 데이터 사용');
                    return JSON.parse(cachedNews);
                }
            }

            // 실제 API 호출
            console.log('서버에서 데이터 가져오는 중...');
            const response = await fetch(`${SERVER_URL}/news`);
            if (!response.ok) {
                throw new Error(`서버 연결 실패 (HTTP ${response.status})`);
            }
            
            const newsArr = await response.json();
            console.log('받아온 뉴스 데이터:', newsArr);
            
            // 캐시 저장
            localStorage.setItem('newsCache', JSON.stringify(newsArr));
            localStorage.setItem('newsCacheTimestamp', String(new Date().getTime()));
            
            return Array.isArray(newsArr) ? newsArr : [];
        } catch (error) {
            console.error('뉴스 데이터 로드 실패:', error);
            
            // 에러 발생 시 캐시된 데이터라도 반환
            const cachedNews = localStorage.getItem('newsCache');
            if (cachedNews) {
                console.log('에러 발생, 캐시된 데이터 사용');
                return JSON.parse(cachedNews);
            }
            
            throw error;
        }
    },
};

function MedicalCarousel() {
    const parentRef = useRef(null);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // 브랜드 컬러를 활용한 아이콘 색상
    const medicalIcons = [
        <Stethoscope size={24} color="#85AFFC" />,
        <Heart size={24} color="#94BDF2" />,
        <Activity size={24} color="#ACD7F2" />,
        <Stethoscope size={24} color="#B4D2FF" />
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const newsArr = await newsAPI.getAllNews();
                setNewsData(Array.isArray(newsArr) ? newsArr : []);
                setError(null);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
                setError(err.message);
                setNewsData([]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!isAutoPlay || newsData.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % newsData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlay, newsData.length]);

    useEffect(() => {
        if (!parentRef.current) return;
      
        const inc = () => {
          const n = +(document.body.dataset.headerTheme || 0) + 1;
          document.body.dataset.headerTheme = String(n);
          document.body.classList.add('header-red');
        };
        const dec = () => {
          const n = Math.max(0, +(document.body.dataset.headerTheme || 0) - 1);
          document.body.dataset.headerTheme = String(n);
          if (n === 0) document.body.classList.remove('header-red');
        };
      
        const st = ScrollTrigger.create({
          id: 'home3-theme',
          trigger: parentRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: inc,
          onEnterBack: inc,
          onLeave: dec,
          onLeaveBack: dec,
        });
      
        return () => {
          st.kill();
          dec();
        };
    }, []);

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % newsData.length);
        setIsAutoPlay(false);
    };
    
    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + newsData.length) % newsData.length);
        setIsAutoPlay(false);
    };

    const openLink = (url) => {
        if (url && url.startsWith('http')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert('유효한 링크가 없습니다');
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        window.location.reload();
    };

    if (loading) {
        return (
            <div className={styles.carouselRoot} ref={parentRef}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>뉴스 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.carouselRoot} ref={parentRef}>
                <div className={styles.loadingContainer}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>
                        ⚠️ 데이터 로드 실패: {error}
                    </p>
                    <button 
                        onClick={handleRetry}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#85AFFC',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (newsData.length === 0) {
        return (
            <div className={styles.carouselRoot} ref={parentRef}>
                <div className={styles.loadingContainer}>
                    <p>표시할 뉴스가 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.carouselRoot} ref={parentRef}>
            {/* 섹션 타이틀 */}
            <div style={{
                textAlign: 'center',
                marginBottom: '60px',
                animation: 'fadeInUp 0.8s ease-out'
            }}>
                <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#85AFFC',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '12px'
                }}>
                    Medical News
                </p>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#1F2937',
                    margin: 0,
                    lineHeight: 1.2
                }}>
                    최신 의학 뉴스
                </h2>
            </div>

            <div className={styles.carouselSection}>
                <button 
                    className={`${styles.navButton} ${styles.navLeft}`} 
                    onClick={prevSlide}
                    aria-label="이전 뉴스"
                >
                    <ChevronLeft size={20} color="#6B7280" />
                </button>

                <div className={styles.carouselViewport}>
                    <div 
                        className={styles.carouselTrack}
                        style={{
                            transform: `translateX(calc(-${currentIndex * 640}px + 50% - 320px))`
                        }}
                    >
                        {newsData.map((news, index) => (
                            <div
                                key={news.id || index}
                                className={`${styles.carouselSlide} ${
                                    index === currentIndex ? styles.active : styles.inactive
                                }`}
                            >
                                <div className={styles.slideContent}>
                                    <div className={styles.slideIcon}>
                                        {medicalIcons[index % medicalIcons.length]}
                                    </div>
                                    <h3 className={styles.slideTitle}>
                                        {news.title || '제목 없음'}
                                    </h3>
                                    <p className={styles.slideDate}>
                                        {news.date || news.publishedDate || new Date().toLocaleDateString('ko-KR')}
                                    </p>
                                    <p className={styles.slideDescription}>
                                        {news.content || news.description || news.summary || '내용이 없습니다.'}
                                    </p>
                                    <button
                                        className={styles.slideButton}
                                        onClick={() => openLink(news.newsUrl || news.url || news.link)}
                                    >
                                        더 보기
                                        <ArrowRight size={16} color="#FFFFFF" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    className={`${styles.navButton} ${styles.navRight}`} 
                    onClick={nextSlide}
                    aria-label="다음 뉴스"
                >
                    <ChevronRight size={20} color="#6B7280" />
                </button>

                {/* 자동 재생 컨트롤 - 중앙 하단 */}
                <button
                    className={styles.playButton}
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    aria-label={isAutoPlay ? '자동재생 중지' : '자동재생 시작'}
                >
                    {isAutoPlay ? <Pause size={22} color="#85AFFC" /> : <Play size={22} color="#85AFFC" />}
                </button>
            </div>
        </div>
    );
}

export default MedicalCarousel;