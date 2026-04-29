import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { APPS_DATA } from '../data/content';
import './Planetarium.css';

interface PlanetariumProps {
  isOpen: boolean;
  onClose: () => void;
}

const planetBase = [
  { 
    id: 'mercury', name: 'Mercury', au: '0.4 AU', num: 1, color: '#E5E5E5', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
    detailedDesc: "Mercury is the closest planet to the sun. As such, it circles the sun faster than all the other planets, which is why Romans named it after their swift-footed messenger god.\n\nThe Sumerians also knew of Mercury since at least 5,000 years ago. It was often associated with Nabu, the god of writing. Mercury was also given separate names for its appearance as both a morning star and as an evening star. Greek astronomers knew, however, that the two names referred to the same body, and Heraclitus, around 500 B.C., correctly thought that both Mercury and Venus orbited the sun, not Earth.\n\nA year on Mercury is just 88 days long.\n\nOne solar day (the time from noon to noon on the planet’s surface) on Mercury lasts the equivalent of 176 Earth days while the sidereal day (the time for 1 rotation in relation to a fixed point) lasts 59 Earth days. Mercury is nearly tidally locked to the Sun and over time this has slowed the rotation of the planet to almost match its orbit around the Sun. Mercury also has the highest orbital eccentricity of all the planets with its distance from the Sun ranging from 46 to 70 million km.",
    outerSurfaceImg: 'https://i.ibb.co/9mBQJ0h5/wikiimages-mercury-11591-640.png'
  },
  { 
    id: 'venus', name: 'Venus', au: '0.7 AU', num: 2, color: '#F5DEB3', img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg',
    detailedDesc: "Venus is the second planet from the Sun and is Earth’s closest planetary neighbor. It’s one of the four inner, terrestrial (or rocky) planets, and it’s often called Earth’s twin because it’s similar in size and density. These are not identical twins, however – there are radical differences between the two worlds.\n\nVenus has a thick, toxic atmosphere filled with carbon dioxide and it’s perpetually shrouded in thick, yellowish clouds of sulfuric acid that trap heat, causing a runaway greenhouse effect. It’s the hottest planet in our solar system, even though Mercury is closer to the Sun. Surface temperatures on Venus are about 900 degrees Fahrenheit (475 degrees Celsius) – hot enough to melt lead.\n\nVenus spins slowly in the opposite direction from most planets. A year on Venus takes 225 Earth days, but a Venusian day is 243 Earth days long, making its day longer than its year!"
  },
  { 
    id: 'earth', name: 'Earth', au: '1.0 AU', num: 3, color: '#2B82C9', img: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    detailedDesc: "Our home planet is the third planet from the Sun, and the only place we know of so far that’s inhabited by living things.\n\nWhile Earth is only the fifth largest planet in the solar system, it is the only world in our solar system with liquid water on the surface. Just slightly larger than nearby Venus, Earth is the biggest of the four planets closest to the Sun, all of which are made of rock and metal.\n\nEarth is the only planet in the solar system whose English name does not come from Greek or Roman mythology. The name was taken from Old English and Germanic words for ground and earth. It has one moon and a dynamic atmosphere that sustains life, protecting us from meteoroids and radiation."
  },
  { 
    id: 'mars', name: 'Mars', au: '1.5 AU', num: 4, color: '#F05A28', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    detailedDesc: "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past.\n\nMars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape. NASA currently has two rovers (Curiosity and Perseverance), one lander (InSight), and one helicopter (Ingenuity) exploring the surface of Mars.\n\nA Martian day is just a little longer than an Earth day, at 24.6 hours. A Martian year, however, is 687 Earth days, almost twice as long as an Earth year. Mars has two small moons, Phobos and Deimos."
  },
  { 
    id: 'jupiter', name: 'Jupiter', au: '5.2 AU', num: 5, color: '#C88B3A', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    detailedDesc: "Jupiter is the fifth planet from our Sun and is, by far, the largest planet in the solar system – more than twice as massive as all the other planets combined.\n\nJupiter's familiar stripes and swirls are actually cold, windy clouds of ammonia and water, floating in an atmosphere of hydrogen and helium. Jupiter’s iconic Great Red Spot is a giant storm bigger than Earth that has raged for hundreds of years.\n\nJupiter rotates once about every 10 hours (a Jovian day), but takes about 12 Earth years to complete one orbit of the Sun (a Jovian year). The planet has dozens of moons and also has several rings, but unlike the famous rings of Saturn, Jupiter’s rings are very faint and made of dust, not ice."
  },
  { 
    id: 'saturn', name: 'Saturn', au: '9.5 AU', num: 6, color: '#EAD6B8', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
    detailedDesc: "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar neighborhood.\n\nThe other giant planets have rings, but none are as spectacular or as complicated as Saturn's. Like fellow gas giant Jupiter, Saturn is a massive ball made mostly of hydrogen and helium.\n\nSaturn is the farthest planet from Earth discovered by the unaided human eye, known since ancient times. A day on Saturn goes by in just 10.7 hours, and it takes 29.4 Earth years to orbit the Sun. Saturn has 146 moons in its orbit, the most of any planet in the solar system."
  },
  { 
    id: 'uranus', name: 'Uranus', au: '19.2 AU', num: 7, color: '#4E95D6', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
    detailedDesc: "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope, discovered in 1781 by astronomer William Herschel.\n\nUranus is an ice giant. Most of its mass is a hot, dense fluid of 'icy' materials – water, methane, and ammonia – above a small rocky core. Uranus has an atmosphere made mostly of molecular hydrogen and atomic helium, with a small amount of methane. The methane gives Uranus its signature blue color.\n\nUranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side. A day on Uranus takes about 17 hours, and it makes a complete orbit around the Sun in about 84 Earth years."
  },
  { 
    id: 'neptune', name: 'Neptune', au: '30.1 AU', num: 8, color: '#274687', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
    detailedDesc: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant major planet orbiting our Sun.\n\nMore than 30 times as far from the Sun as Earth, Neptune is the only planet in our solar system not visible to the naked eye and the first predicted by mathematics before its discovery. In 1846, Johann Galle discovered the planet at the observatory in Berlin.\n\nNeptune is very similar to Uranus. It's made of a thick soup of water, ammonia, and methane over an Earth-sized solid center. Its atmosphere is made of hydrogen, helium, and methane. The methane gives Neptune the same blue color as Uranus. Neptune has 14 known moons and five main rings."
  },
  { 
    id: 'pluto', name: 'Pluto', au: '39.5 AU', num: 9, color: '#D1CDCB', img: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg',
    detailedDesc: "Pluto is a dwarf planet in the Kuiper Belt, a donut-shaped region of icy bodies beyond the orbit of Neptune. There may be millions of these icy objects, collectively referred to as Kuiper Belt objects (KBOs) or trans-Neptunian objects (TNOs).\n\nPluto – which is smaller than Earth’s Moon – has a heart-shaped glacier that’s the size of Texas and Oklahoma. This fascinating world has blue skies, spinning moons, mountains as high as the Rockies, and it snows – but the snow is red.\n\nDiscovered in 1930, Pluto was long considered our solar system's ninth planet. But after the discovery of similar intriguing worlds deeper in the distant Kuiper Belt, icy Pluto was reclassified as a dwarf planet. A year on Pluto is 248 Earth years, and a day on Pluto lasts 153 hours."
  }
];

// Map planets to apps
const planets = planetBase.map((p, index) => {
  const app = APPS_DATA[index] || APPS_DATA[0];
  return {
    ...p,
    appTitle: app.title,
    appDesc: app.description,
    appLogo: app.logo,
    appContent: app.content,
    appRelease: app.releaseDate,
    appPricing: app.pricing,
    character: app.character
  };
});

const PlanetView = ({ p, index, smoothX, smoothY, onReadMore }: { p: any, index: number, smoothX: any, smoothY: any, onReadMore: (id: string) => void }) => {
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
            <p className="text-xs text-gray-300 mb-2 font-bold">{p.appTitle}</p>
            <p className="text-xs text-gray-400 line-clamp-3 mb-3">{p.appDesc}</p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReadMore(p.id);
              }}
              className="read-more-btn"
            >
              Read More
            </button>
          </div>
          <div className='overlay'></div>
        </div>
      </motion.div>
    </div>
  );
};

export const Planetarium: React.FC<PlanetariumProps> = ({ isOpen, onClose }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [planetHtml, setPlanetHtml] = useState<string | null>(null);
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (activePanel) {
      const planet = planets.find(p => p.id === activePanel);
      if (planet) {
        setIsLoadingHtml(true);
        setPlanetHtml(null);
        fetch(`https://sriudhai.github.io/mercury.text/${planet.name.toUpperCase()}`)
          .then(res => res.text())
          .then(html => {
            // Process HTML to convert image links to actual images
            // The HTML has patterns like: <a href="https://i.ibb.co/9mBQJ0h5/wikiimages-mercury-11591-640.png">...</a>
            let processedHtml = html;
            
            // Find all anchor tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const links = tempDiv.querySelectorAll('a');
            
            links.forEach(link => {
              const href = link.getAttribute('href');
              if (href && (href.match(/\.(jpeg|jpg|gif|png)$/) || href.includes('i.ibb.co'))) {
                const img = document.createElement('img');
                img.src = href;
                img.className = "w-full rounded-lg border border-white/10 my-4";
                img.alt = "Planet Surface";
                
                // Find the parent paragraph if it contains the "OUTER SURFACE" text
                let parent = link.parentElement;
                while (parent && parent.tagName !== 'P' && parent !== tempDiv) {
                  parent = parent.parentElement;
                }
                
                if (parent && parent.tagName === 'P' && parent.textContent?.includes('OUTER SURFACE')) {
                  parent.replaceWith(img);
                } else {
                  link.replaceWith(img);
                }
              }
            });
            
            // Clean up the { PlanetName and } at the start/end
            let finalHtml = tempDiv.innerHTML;
            finalHtml = finalHtml.replace(/{[\s\S]*?<strong>.*?<\/strong><\/p>/, '');
            finalHtml = finalHtml.replace(/}<\/span><\/p>[\s\n]*$/, '</p>');
            finalHtml = finalHtml.replace(/<p><span[^>]*>&nbsp;<\/span><\/p>/g, '');
            finalHtml = finalHtml.replace(/<p><strong>.*?<\/strong><\/p>/, '');
            finalHtml = finalHtml.replace(/<p><span[^>]*>&nbsp;<\/span><strong>.*?<\/strong><\/p>/, '');
            
            setPlanetHtml(finalHtml);
            setIsLoadingHtml(false);
          })
          .catch(err => {
            console.error("Failed to fetch planet HTML:", err);
            setIsLoadingHtml(false);
          });
      }
    } else {
      setPlanetHtml(null);
    }
  }, [activePanel]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40); 
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  if (!isOpen) return null;

  const activePlanet = planets.find(p => p.id === activePanel);

  return (
    <div className="planetarium-overlay" onMouseMove={handleMouseMove}>
      <button onClick={onClose} className="close-btn">
        <X size={32} />
      </button>

      <div className="planetarium-container">
        <div className='logo flex items-center gap-4'>
          <img src="https://i.ibb.co/KptDmbVD/SK-GROUP-OF-COMPANY.jpg" alt="SK Group Logo" className="h-12 w-auto object-contain rounded-full" />
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
            onChange={() => setActivePanel(null)}
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
                <h3>{p.appTitle}</h3>
              </div>
            </label>
          ))}
        </div>

        {/* Solar System 3D View */}
        <div className='solar'>
          {planets.map((p, index) => (
            <PlanetView 
              key={`solar-${p.id}`} 
              p={p} 
              index={index} 
              smoothX={smoothX} 
              smoothY={smoothY} 
              onReadMore={setActivePanel}
            />
          ))}
        </div>

        {/* Read More Panel (React State Based) */}
        {activePanel && (
          <div className="closeBig" style={{ display: 'block' }} onClick={() => setActivePanel(null)}></div>
        )}
        <div className={`panel ${activePanel ? 'panel-open' : ''}`}>
          {activePlanet && (
            <div className="panel-content h-full overflow-y-auto pr-4 custom-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <img src={activePlanet.appLogo} alt={activePlanet.appTitle} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h2 className="!mb-1 !text-2xl">{activePlanet.name}</h2>
                  <p className="!text-sm !text-gray-400 !mb-0">{activePlanet.appTitle}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 border-b border-white/10 pb-2">About the Planet</h3>
                  {isLoadingHtml ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-[#cc0000] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : planetHtml ? (
                    <div 
                      className="text-sm text-gray-300 leading-relaxed whitespace-pre-line prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-headings:text-white prose-a:text-[#cc0000]"
                      dangerouslySetInnerHTML={{ __html: planetHtml }}
                    />
                  ) : (
                    <>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {activePlanet.detailedDesc}
                      </p>
                      {activePlanet.outerSurfaceImg && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Outer Surface</p>
                          <img src={activePlanet.outerSurfaceImg} alt={`${activePlanet.name} Outer Surface`} className="w-full rounded-lg border border-white/10" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 border-b border-white/10 pb-2">SK Application: {activePlanet.appTitle}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activePlanet.appDesc}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 border-b border-white/10 pb-2">Features</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activePlanet.appContent}
                  </p>
                </div>

                {activePlanet.appPricing && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 border-b border-white/10 pb-2">Pricing</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {activePlanet.appPricing}
                    </p>
                  </div>
                )}

                {activePlanet.character && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={activePlanet.character.img} alt={activePlanet.character.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-white">{activePlanet.character.name}</h4>
                        <p className="text-xs text-gray-400">{activePlanet.character.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 italic mb-3">"{activePlanet.character.quote}"</p>
                    {activePlanet.character.abilities && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activePlanet.character.abilities.map((ability: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-gray-300">
                            {ability}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setActivePanel(null)} className="close-panel mt-8 w-full text-center">
                Close Transmission
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
