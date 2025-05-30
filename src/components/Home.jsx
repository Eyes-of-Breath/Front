import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>홈 페이지</h1>
      <button onClick={goToLogin}>로그인</button>
    </div>
  );
}

export default Home;
