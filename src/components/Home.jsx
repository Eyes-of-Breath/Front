import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, } from "react";

function Home() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');

  const outerDivRef = useRef();

  const DIVIDER_HEIGHT = 5;
  const MIN_SCROLL_THRESHOLD = 100;
  const sections = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = window.innerHeight;

      if (Math.abs(deltaY) < MIN_SCROLL_THRESHOLD) return;

      const currentIndex = Math.round(scrollTop / (pageHeight + DIVIDER_HEIGHT));
      let targetIndex = currentIndex;

      if (deltaY > 0 && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1;
      } else if (deltaY < 0 && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }

      outerDivRef.current.scrollTo({
        top: targetIndex * (pageHeight + DIVIDER_HEIGHT),
        left: 0,
        behavior: "smooth",
      });
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, [sections.length]);

  return (
    <div>
      <div className='toolbar'>
        <h1>VITMED</h1>
        <p className='title' onClick={goToLogin}>로그인</p>
      </div>
      <div ref={outerDivRef} className="outer">
        <div className="inner bg-light-gray">1</div>
        <div className="inner bg-gray">2</div>
        <div className="inner bg-light-gray">3</div>
        <div className="inner bg-gray">4</div>
        <div className="inner bg-light-gray">5</div>
        <div className="inner bg-gray">6</div>
      </div>
    </div>
  );
}

export default Home;
