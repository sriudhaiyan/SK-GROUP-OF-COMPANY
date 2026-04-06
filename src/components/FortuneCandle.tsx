import React, { useState, useEffect } from 'react';

const fortunes = [
  "A great adventure awaits you today.",
  "Your creativity will lead to unexpected success.",
  "Trust your instincts; they are guiding you right.",
  "A pleasant surprise is waiting just around the corner.",
  "Your hard work is about to pay off brilliantly."
];

export function FortuneCandle() {
  const [isLit, setIsLit] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const [fortune, setFortune] = useState("✨ Click the matchstick to reveal your fortune");
  const [isRevealed, setIsRevealed] = useState(false);

  const lightCandle = () => {
    if (isLit) return;
    
    setIsStriking(true);

    setTimeout(() => {
      setIsLit(true);
      
      setTimeout(() => {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        setFortune(`✨ ${randomFortune}`);
        setIsRevealed(true);
      }, 500);
    }, 500);
  };

  return (
    <div className="w-full py-24 flex justify-center items-center bg-black relative z-20 border-t border-white/10">
      <div className="text-center relative">
        <style>{`
          .candle-container {
            position: relative;
            margin: 0 auto;
            width: 30px;
            height: 120px;
          }
          .candle-body {
            width: 30px;
            height: 120px;
            background: linear-gradient(to bottom, #fff, #ddd);
            border-radius: 8px;
            position: relative;
            box-shadow: inset -5px 0 10px rgba(0,0,0,0.1);
          }
          .candle-body::before {
            content: '';
            position: absolute;
            top: -10px;
            left: 13px;
            width: 4px;
            height: 15px;
            background: #333;
            border-radius: 2px;
          }
          .flame {
            width: 20px;
            height: 35px;
            background: radial-gradient(ellipse at bottom, #ffeb3b 10%, #ff9800 40%, #f44336 80%, transparent);
            border-radius: 50% 50% 20% 20%;
            position: absolute;
            top: -40px;
            left: 5px;
            filter: blur(1px);
            opacity: 0;
            transform-origin: bottom center;
            transition: opacity 0.5s ease-in-out;
          }
          .flame.lit {
            opacity: 1;
            animation: flicker 0.1s infinite alternate, sway 2s infinite ease-in-out;
            box-shadow: 0 0 40px 15px rgba(255, 152, 0, 0.6);
          }
          @keyframes flicker {
            0% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
            100% { transform: scale(1.05) rotate(2deg); opacity: 1; }
          }
          @keyframes sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          .matchstick {
            width: 60px;
            height: 6px;
            background: #8d6e63;
            position: absolute;
            top: -20px;
            left: -80px;
            border-radius: 3px;
            cursor: pointer;
            transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
            z-index: 10;
          }
          .matchstick::after {
            content: '';
            position: absolute;
            right: -5px;
            top: -2px;
            width: 12px;
            height: 10px;
            background: #d32f2f;
            border-radius: 50%;
          }
          .matchstick.strike {
            transform: translateX(80px) rotate(15deg);
          }
          .fortune-text {
            margin-top: 40px;
            font-size: 1.2rem;
            font-weight: 300;
            letter-spacing: 1px;
            opacity: 0.7;
            transition: opacity 1s ease-in-out, transform 1s ease-in-out;
            font-family: 'Segoe UI', sans-serif;
            color: white;
          }
          .fortune-text.reveal {
            opacity: 1;
            transform: translateY(-10px);
            color: #ffeb3b;
            text-shadow: 0 0 10px rgba(255, 235, 59, 0.5);
          }
        `}</style>
        
        <div className="candle-container">
          <div 
            className={`matchstick ${isStriking ? 'strike' : ''}`} 
            onClick={lightCandle}
            style={{ opacity: isLit ? 0 : 1 }}
          />
          <div className="candle-body">
            <div className={`flame ${isLit ? 'lit' : ''}`} />
          </div>
        </div>

        <div className={`fortune-text ${isRevealed ? 'reveal' : ''}`}>
          {fortune}
        </div>
      </div>
    </div>
  );
}
