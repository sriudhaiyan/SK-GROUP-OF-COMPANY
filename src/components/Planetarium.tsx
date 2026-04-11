import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import './Planetarium.css';

interface PlanetariumProps {
  isOpen: boolean;
  onClose: () => void;
}

const planets = [
  { id: 'mercury', name: 'Mercury', au: '0.4 AU', num: 1, desc: 'The smallest planet in our solar system and closest to the Sun.', color: '#E5E5E5', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg' },
  { id: 'venus', name: 'Venus', au: '0.7 AU', num: 2, desc: 'Spinning in the opposite direction to most planets.', color: '#F5DEB3', img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg' },
  { id: 'earth', name: 'Earth', au: '1.0 AU', num: 3, desc: 'Our home planet is the only place we know of so far that’s inhabited by living things.', color: '#2B82C9', img: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg' },
  { id: 'mars', name: 'Mars', au: '1.5 AU', num: 4, desc: 'A dusty, cold, desert world with a very thin atmosphere.', color: '#F05A28', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
  { id: 'jupiter', name: 'Jupiter', au: '5.2 AU', num: 5, desc: 'More than twice as massive than the other planets of our solar system combined.', color: '#C88B3A', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
  { id: 'saturn', name: 'Saturn', au: '9.5 AU', num: 6, desc: 'Adorned with a dazzling, complex system of icy rings.', color: '#EAD6B8', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg' },
  { id: 'uranus', name: 'Uranus', au: '19.2 AU', num: 7, desc: 'The seventh planet from the Sun with the third-largest diameter in our solar system.', color: '#4E95D6', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg' },
  { id: 'neptune', name: 'Neptune', au: '30.1 AU', num: 8, desc: 'Dark, cold, and whipped by supersonic winds.', color: '#274687', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg' },
  { id: 'pluto', name: 'Pluto', au: '39.5 AU', num: 9, desc: 'A complex world of ice mountains and frozen plains.', color: '#D1CDCB', img: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg' }
];

const PlanetView = ({ p, index, smoothX, smoothY }: { p: any, index: number, smoothX: any, smoothY: any }) => {
  const depth = (index + 1) * 0.4;
  const x = useTransform(smoothX, (v: number) => v * depth);
  const y = useTransform(smoothY, (v: number) => v * depth);

  return (
    <div className='solar_systm'>
      <motion.div
        style={{
          x,
          y,
          width: '100%',
          height: '100%',
          position: 'absolute'
        }}
      >
        <div 
          className={`planet ${p.id}-planet`} 
          style={{ 
            backgroundColor: p.color,
            backgroundImage: `url(${p.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className='planet_description'>
            <h2>{p.name}</h2>
            <p>{p.desc}</p>
            <label htmlFor={`read${p.name}`}>Read More</label>
          </div>
          <div className='overlay'></div>
        </div>
      </motion.div>
    </div>
  );
};

export const Planetarium: React.FC<PlanetariumProps> = ({ isOpen, onClose }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40); 
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  if (!isOpen) return null;

  return (
    <div className="planetarium-overlay" onMouseMove={handleMouseMove}>
      <button onClick={onClose} className="close-btn">
        <X size={32} />
      </button>

      <div className="planetarium-container">
        <div className='logo flex items-center gap-4'>
          <img src="https://i.ibb.co/MyJSD5dk/1763888185441.png" alt="SK Group Logo" className="h-12 w-auto object-contain" />
          <div>
            SK PLANETARIUM
            <span>SK GROUP OF COMPANY</span>
          </div>
        </div>

        {/* Radio Inputs for Navigation */}
        {planets.slice().reverse().map((p) => (
          <input 
            key={`input-${p.id}`} 
            className={`planet${p.num}`} 
            id={p.id} 
            type='radio' 
            name='planet' 
            defaultChecked={p.id === 'earth'}
          />
        ))}

        {/* Labels for Navigation */}
        <div className="menu-container">
          {planets.slice().reverse().map((p) => (
            <label key={`label-${p.id}`} className={`menu ${p.id}`} htmlFor={p.id}>
              <div className='preview' style={{ backgroundColor: p.color, backgroundImage: `url(${p.img})`, backgroundSize: 'cover' }}></div>
              <div className='info'>
                <h2>
                  <div className='pip' style={{ backgroundColor: p.color }}></div>
                  {p.name}
                </h2>
                <h3>{p.au}</h3>
              </div>
            </label>
          ))}
        </div>

        {/* Solar System 3D View */}
        <div className='solar'>
          {planets.map((p, index) => (
            <PlanetView key={`solar-${p.id}`} p={p} index={index} smoothX={smoothX} smoothY={smoothY} />
          ))}
        </div>

        {/* Read More Panels */}
        {planets.map((p) => (
          <React.Fragment key={`panel-${p.id}`}>
            <input className='read' id={`read${p.name}`} type='radio' name='readPanel' />
            <label className='closeBig' htmlFor={`close${p.name}`}></label>
            <div className='panel'>
              <div className="panel-content">
                <h2>{p.name}</h2>
                <p>{p.desc}</p>
                <p>Detailed information about {p.name} goes here. This panel slides in when "Read More" is clicked.</p>
                <label htmlFor={`close${p.name}`} className="close-panel">Close</label>
              </div>
            </div>
            <input className='read-close' id={`close${p.name}`} type='radio' name='readPanel' />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
