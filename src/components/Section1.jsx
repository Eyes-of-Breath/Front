import React, {  } from 'react';
import './Section1.css';


function Section1() {

    return (
        <div className='parent'>
            <h3>What is the goal of our project?</h3>
            <p>
                It is to find a lung disease.<br/>
                Then how?<br/>
                Use ViT models to express and quantify areas of suspected disease.    
            </p>
        </div>
    );
}

export default Section1;