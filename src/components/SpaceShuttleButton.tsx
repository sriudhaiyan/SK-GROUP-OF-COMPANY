import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpaceShuttleButton.css';

export function SpaceShuttleButton() {
  const [isLaunching, setIsLaunching] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    
    // Navigate to portal after animation completes (7 seconds)
    setTimeout(() => {
      navigate('/planetarium');
    }, 7000);
  };

  return (
    <button className={`shuttle-btn ${isLaunching ? 'launching' : ''}`} onClick={handleLaunch}>
      <div className="space-bg"></div>
      <div className="stars"></div>
      
      <div className="asteroids">
        <span style={{ '--tx': '-800px', '--ty': '-600px', animationDelay: '0s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '800px', '--ty': '-400px', animationDelay: '0.3s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '-600px', '--ty': '800px', animationDelay: '0.6s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '700px', '--ty': '700px', animationDelay: '0.9s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '200px', '--ty': '-900px', animationDelay: '1.2s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '-900px', '--ty': '200px', animationDelay: '0.4s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '900px', '--ty': '100px', animationDelay: '0.8s' } as React.CSSProperties}></span>
        <span style={{ '--tx': '-300px', '--ty': '-800px', animationDelay: '1.1s' } as React.CSSProperties}></span>
      </div>
      
      <div className="portal"></div>
      
      <div className="shuttle">
        {/* Pilot (Chibi) */}
        <div className="chibi">
          <div className="face">
            <div className="eyes"></div>
            <div className="mouth"></div>
          </div>
        </div>
        {/* Shuttle Body */}
        <div className="body"></div>
        <div className="wings"></div>
        <div className="engine-fire"></div>
      </div>
      
      <span className="btn-text">SPACE SHUTTLE</span>
    </button>
  );
}
