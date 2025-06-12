import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <div className='toolbar'>
        <h1>VITMED</h1>
        <p className='title' onClick={goToLogin}>로그인</p>
      </div>


    </div>

  );
}

export default Home;
