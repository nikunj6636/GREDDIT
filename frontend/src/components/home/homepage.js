import React from 'react';
import Navbar from '../navbar';
import "./homepage.css"

const HomePage = () => {
    
    return  (
        <div>
            <Navbar />
            <div className='welcome'>
                <h1>Hi! Welcome to Greddit</h1>
            </div>
        </div>
    )
}

export default HomePage;