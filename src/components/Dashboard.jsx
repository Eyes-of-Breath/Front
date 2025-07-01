import React, {  } from 'react';
import './Dashboard.css';

function Dashboard() {

    return (
        <div className='dashboard'>
            <div className='leftside'>
                <button type='button'>대시보드</button>
                <button type='button'>이미지 분석</button>
                <button type='button'>기록</button>
                <button type='button'>프로필</button>
            </div>
            <div className='rightside'>
                <h1>대시보드</h1>
            </div>
        </div>
    );
}

export default Dashboard;