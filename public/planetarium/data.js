const planetData = {
  Mercury: {
    title: "The Swift Planet",
    description: "Mercury is the closest planet to the sun. As such, it circles the sun faster than all the other planets, which is why Romans named it after their swift-footed messenger god. The Sumerians also knew of Mercury since at least 5,000 years ago. It was often associated with Nabu, the god of writing. Mercury was also given separate names for its appearance as both a morning star and as an evening star. Greek astronomers knew, however, that the two names referred to the same body, and Heraclitus, around 500 B.C., correctly thought that both Mercury and Venus orbited the sun, not Earth.",
    image: "https://i.ibb.co/9mBQJ0h5/wikiimages-mercury-11591-640.png",
    facts: [
      { title: "A year on Mercury is just 88 days long.", desc: "One solar day (the time from noon to noon on the planet’s surface) on Mercury lasts the equivalent of 176 Earth days while the sidereal day (the time for 1 rotation in relation to a fixed point) lasts 59 Earth days. Mercury is nearly tidally locked to the Sun and over time this has slowed the rotation of the planet to almost match its orbit around the Sun. Mercury also has the highest orbital eccentricity of all the planets with its distance from the Sun ranging from 46 to 70 million km." },
      { title: "Mercury is the smallest planet in the Solar System.", desc: "One of five planets visible with the naked eye a, Mercury is just 4,879 Kilometers across its equator, compared with 12,742 Kilometers for the Earth." },
      { title: "Mercury is the second densest planet.", desc: "Even though the planet is small, Mercury is very dense. Each cubic centimeter has a density of 5.4 grams, with only the Earth having a higher density. This is largely due to Mercury being composed mainly of heavy metals and rock." },
      { title: "Mercury has wrinkles.", desc: "As the iron core of the planet cooled and contracted, the surface of the planet became wrinkled. Scientist have named these wrinkles, Lobate Scarps. These Scarps can be up to a mile high and hundreds of miles long." }
    ]
  },
  Venus: {
    title: "The Morning Star",
    description: "Venus, the second planet from the sun, is named for the Roman goddess of love and beauty. The planet — the only planet named after a female — may have been named for the most beautiful deity of her pantheon because it shone the brightest of the five planets known to ancient astronomers. In ancient times, Venus was often thought to be two different stars, the evening star and the morning star — that is, the ones that first appeared at sunset and sunrise. In Latin, they were respectively known as Vesper and Lucifer. In Christian times, Lucifer, or \"light-bringer,\" became known as the name of Satan before his fall. However, further observations of Venus in the space age show a very hellish environment. This makes Venus a very difficult planet to observe from up close, because spacecraft do not survive long on its surface.",
    image: "https://i.ibb.co/kVhfwGt7/wikiimages-venus-11022.jpg",
    image2: "https://i.ibb.co/cXFFhM0c/wikiimages-maat-mons-11584.jpg",
    facts: [
      { title: "A day on Venus lasts longer than a year.", desc: "It takes 243 Earth days to rotate once on its axis (sidereal day). The planet’s orbit around the Sun takes 225 Earth days, compared to the Earth’s 365. A day on the surface of Venus (solar day) takes 117 Earth days." },
      { title: "Venus rotates in the opposite direction to most other planets.", desc: "This means that Venus is rotating in the opposite direction to the Sun, this is also know as a retrograde rotation. A possible reason might be a collision in the past with an asteroid or other object that caused the planet to alter its rotational path. It also differs from most other planets in our solar system by having no natural satellites." },
      { title: "Venus is the second brightest object in the night sky.", desc: "Only the Moon is brighter. With a magnitude of between -3.8 to -4.6 Venus is so bright it can be seen during daytime on a clear day." },
      { title: "Atmospheric pressure on Venus is 92 times greater than the Earth’s.", desc: "While its size and mass are similar to Earth, the small asteroids are crushed when entering its atmosphere, meaning no small craters lie on the surface of the planet. The pressure felt by a human on the surface would be equivalent to that experienced deep beneath the sea on Earth." }
    ]
  },
  Earth: {
    title: "Our Home",
    description: "Earth, our home, is the third planet from the sun. It is the only planet known to have an atmosphere containing free oxygen, oceans of liquid water on its surface, and, of course, life. Earth is the fifth largest of the planets in the solar system — smaller than the four gas giants, Jupiter, Saturn, Uranus and Neptune, but larger than the three other rocky planets,",
    image: "https://i.ibb.co/mVSk62bF/wikiimages-earth-11008.jpg",
    image2: "https://i.ibb.co/5xh75S7B/chiemseherin-seiser-alm-8123284.jpg",
    facts: [
      { title: "The Earth’s rotation is gradually slowing.", desc: "This deceleration is happening almost imperceptibly, at approximately 17 milliseconds per hundred years, although the rate at which it occurs is not perfectly uniform. This has the effect of lengthening our days, but it happens so slowly that it could be as much as 140 million years before the length of a day will have increased to 25 hours." },
      { title: "The Earth was once believed to be the center of the universe.", desc: "Due to the apparent movements of the Sun and planets in relation to their viewpoint, ancient scientists insisted that the Earth remained static, whilst other celestial bodies traveled in circular orbits around it. Eventually, the view that the Sun was at the center of the universe was postulated by Copernicus, though this is also not the case." },
      { title: "Earth has a powerful magnetic field.", desc: "This phenomenon is caused by the nickel-iron core of the planet, coupled with its rapid rotation. This field protects the Earth from the effects of solar wind." },
      { title: "There is only one natural satellite of the planet Earth.", desc: "As a percentage of the size of the body it orbits, the Moon is the largest satellite of any planet in our solar system. In real terms, however, it is only the fifth largest natural satellite." }
    ]
  },
  Mars: {
    title: "The Red Planet",
    description: "Mars is the fourth planet from the sun. Befitting the red planet's bloody color, the Romans named it after their god of war. The Romans copied the ancient Greeks, who also named the planet after their god of war, Ares. Other civilizations also typically gave the planet names based on its color — for example, the Egyptians named it \"Her Desher,\" meaning \"the red one,\" while ancient Chinese astronomers dubbed it \"the fire star.\"",
    image: "https://i.ibb.co/9kg6xMWm/wikiimages-mars-11012.jpg",
    image2: "https://i.ibb.co/HLDHkwrF/wikiimages-mars-67522.jpg",
    facts: [
      { title: "Mars and Earth have approximately the same landmass.", desc: "Even though Mars has only 15% of the Earth’s volume and just over 10% of the Earth’s mass, around two thirds of the Earth’s surface is covered in water. Martian surface gravity is only 37% of the Earth’s (meaning you could leap nearly three times higher on Mars)." },
      { title: "Mars is home to the tallest mountain in the solar system.", desc: "Olympus Mons, a shield volcano, is 21km high and 600km in diameter. Despite having formed over billions of years, evidence from volcanic lava flows is so recent many scientists believe it could still be active." },
      { title: "Only 18 missions to Mars have been successful.", desc: "As of September 2014 there have been 40 missions to Mars, including orbiters, landers and rovers but not counting flybys. The most recent arrivals include the Mars Curiosity mission in 2012, the MAVEN mission, which arrived on September 22, 2014, followed by the Indian Space Research Organization’s MOM Mangalyaan orbiter, which arrived on September 24, 2014. The next missions to arrive will be the European Space Agency’s ExoMars mission, comprising an orbiter, lander, and a rover, followed by NASA’s Insight robotic lander mission, slated for launch in March 2016 and a planned arrival in September, 2016." },
      { title: "Mars has the largest dust storms in the solar system.", desc: "They can last for months and cover the entire planet. The seasons are extreme because its elliptical (oval-shaped) orbital path around the Sun is more elongated than most other planets in the solar system." }
    ]
  },
  Jupiter: {
    title: "The Gas Giant",
    description: "Jupiter is the largest planet in the solar system. Fittingly, it was named after the king of the gods in Roman mythology. In a similar manner, the ancient Greeks named the planet after Zeus, the king of the Greek pantheon. Jupiter helped revolutionize the way we saw the universe and ourselves in 1610, when Galileo discovered Jupiter's four large moons — Io, Europa, Ganymede and Callisto, now known as the Galilean moons. This was the first time that celestial bodies were seen circling an object other than Earth, major support of the Copernican view that Earth was not the center of the universe.",
    image: "https://i.ibb.co/prfkVTQ5/gustavoackles-space-4869815.jpg",
    facts: [
      { title: "Jupiter is the fourth brightest object in the solar system.", desc: "Only the Sun, Moon and Venus are brighter. It is one of five planets visible to the naked eye from Earth." },
      { title: "The ancient Babylonians were the first to record their sightings of Jupiter.", desc: "This was around the 7th or 8th century BC. Jupiter is named after the king of the Roman gods. To the Greeks, it represented Zeus, the god of thunder. The Mesopotamians saw Jupiter as the god Marduk and patron of the city of Babylon. Germanic tribes saw this planet as Donar, or Thor." },
      { title: "Jupiter has the shortest day of all the planets.", desc: "It turns on its axis once every 9 hours and 55 minutes. The rapid rotation flattens the planet slightly, giving it an oblate shape." },
      { title: "Jupiter orbits the Sun once every 11.8 Earth years.", desc: "From our point of view on Earth, it appears to move slowly in the sky, taking months to move from one constellation to another." }
    ]
  },
  Saturn: {
    title: "The Ringed Planet",
    description: "Saturn is the sixth planet from the sun and the second largest planet in the solar system. Saturn was the Roman name for Cronus, the lord of the Titans in Greek mythology. Saturn is the root of the English word \"Saturday.\" Saturn is the farthest planet from Earth visible to the naked human eye, but it is through a telescope that the planet's most outstanding features can be seen: Saturn's rings. Although the other gas giants in the solar system — Jupiter, Uranus and Neptune — also have rings, those of Saturn are without a doubt the most extraordinary.",
    image: "https://i.ibb.co/HpK4LWwf/16853182-saturn-5255898.jpg",
    facts: [
      { title: "Saturn can be seen with the naked eye.", desc: "It is the fifth brightest object in the solar system and is also easily studied through binoculars or a small telescope." },
      { title: "Saturn was known to the ancients, including the Babylonians and Far Eastern observers.", desc: "It is named for the Roman god Saturnus, and was known to the Greeks as Cronus." },
      { title: "Saturn is the flattest planet.", desc: "Its polar diameter is 90% of its equatorial diameter, this is due to its low density and fast rotation. Saturn turns on its axis once every 10 hours and 34 minutes giving it the second-shortest day of any of the solar system’s planets." },
      { title: "Saturn orbits the Sun once every 29.4 Earth years.", desc: "Its slow movement against the backdrop of stars earned it the nickname of “Lubadsagush” from the ancient Assyrians. The name means “oldest of the old”." }
    ]
  },
  Uranus: {
    title: "The Ice Giant",
    description: "Uranus is the seventh planet from the sun and the first to be discovered by scientists. Although Uranus is visible to the naked eye, it was long mistaken as a star because of the planet's dimness and slow orbit. The planet is also notable for its dramatic tilt, which causes its axis to point nearly directly at the sun. British astronomer William Herschel discovered Uranus accidentally on March 13, 1781, with his telescope while surveying all stars down to those about 10 times dimmer than can be seen by the naked eye. One \"star\" seemed different, and within a year Uranus was shown to follow a planetary orbit.",
    image: "https://i.ibb.co/ccLpGYjt/ragobar-uranus-6063396.jpg",
    facts: [
      { title: "Uranus was officially discovered by Sir William Herschel in 1781.", desc: "It is too dim to have been seen by the ancients. At first Herschel thought it was a comet, but several years later it was confirmed as a planet. Herscal tried to have his discovery named “Georgian Sidus” after King George III. The name Uranus was suggested by astronomer Johann Bode. The name comes from the ancient Greek deity Ouranos." },
      { title: "Uranus turns on its axis once every 17 hours, 14 minutes.", desc: "The planet rotates in a retrograde direction, opposite to the way Earth and most other planets turn." },
      { title: "Uranus makes one trip around the Sun every 84 Earth years.", desc: "During some parts of its orbit one or the other of its poles point directly at the Sun and get about 42 years of direct sunlight. The rest of the time they are in darkness." },
      { title: "Uranus is often referred to as an “ice giant” planet.", desc: "Like the other gas giants, it has a hydrogen upper layer, which has helium mixed in. Below that is an icy “mantle, which surrounds a rock and ice core. The upper atmosphere is made of water, ammonia and the methane ice crystals that give the planet its pale blue colour." }
    ]
  },
  Neptune: {
    title: "The Blue Planet",
    description: "Neptune is the eighth planet from the sun. It was the first planet to get its existence predicted by mathematical calculations before it was actually seen through a telescope on Sept. 23, 1846. Irregularities in the orbit of Uranus led French astronomer Alexis Bouvard to suggest that the gravitational pull from another celestial body might be responsible. German astronomer Johann Galle then relied on subsequent calculations to help spot Neptune via telescope. Previously, astronomer Galileo Galilei sketched the planet, but he mistook it for a star due to its slow motion. In accordance with all the other planets seen in the sky, this new world was given a name from Greek and Roman mythology — Neptune, the Roman god of the sea. Only one mission has flown by Neptune – Voyager 2 in 1989 – meaning that astronomers have done most studies using ground-based telescopes. Today, there are still many mysteries about the cool, blue planet, such as why its winds are so speedy and why its magnetic field is offset.",
    image: "https://i.ibb.co/9HN4gYV1/wikiimages-neptune-67537.jpg",
    facts: [
      { title: "Neptune was not known to the ancients.", desc: "It is not visible to the naked eye and was first observed in 1846. Its position was determined using mathematical predictions. It was named after the Roman god of the sea." },
      { title: "Neptune spins on its axis very rapidly.", desc: "Its equatorial clouds take 18 hours to make one rotation. This is because Neptune is not solid body." },
      { title: "Neptune is the smallest of the ice giants.", desc: "Despite being smaller than Uranus, Neptune has a greater mass. Below its heavy atmosphere, Uranus is made of layers of hydrogen, helium, and methane gases. They enclose a layer of water, ammonia and methane ice. The inner core of the planet is made of rock." },
      { title: "The atmosphere of Neptune is made of hydrogen and helium, with some methane.", desc: "The methane absorbs red light, which makes the planet appear a lovely blue. High, thin clouds drift in the upper atmosphere." }
    ]
  },
  Pluto: {
    title: "The Dwarf Planet",
    description: "Pluto, once considered the ninth and most distant planet from the sun, is now the largest known dwarf planet in the solar system. It is also one of the largest known members of the Kuiper Belt, a shadowy zone beyond the orbit of Neptune thought to be populated by hundreds of thousands of rocky, icy bodies each larger than 62 miles (100 kilometers) across, along with 1 trillion or more comets. In 2006, Pluto was reclassified as a dwarf planet, a change widely thought of as a demotion. The question of Pluto's planet status has attracted controversy and stirred debate in the scientific community, and among the general public, since then. In 2017, a science group (including members of the New Horizon mission) proposed a new definition of planethood based on \"round objects in space smaller than stars,\" which would make the number of planets in our solar system expand from 8 to roughly 100.",
    image: "https://i.ibb.co/zTcpvhtV/thespaceway-pluto-6595130.jpg",
    facts: [
      { title: "Pluto is named after the Greek god of the underworld.", desc: "This is a later name for the more well known Hades and was proposed by Venetia Burney an eleven year old schoolgirl from Oxford, England." },
      { title: "Pluto was reclassified from a planet to a dwarf planet in 2006.", desc: "This is when the IAU formalised the definition of a planet as “A planet is a celestial body that (a) is in orbit around the Sun, (b) has sufficient mass for its self-gravity to overcome rigid body forces so that it assumes a hydrostatic equilibrium (nearly round) shape, and (c) has cleared the neighbourhood around its orbit.”" },
      { title: "Pluto was discovered on February 18th, 1930 by the Lowell Observatory.", desc: "For the 76 years between Pluto being discovered and the time it was reclassified as a dwarf planet it completed under a third of its orbit around the Sun." },
      { title: "Pluto has five known moons.", desc: "The moons are Charon (discovered in 1978,), Hydra and Nix (both discovered in 2005), Kerberos originally P4 (discovered 2011) and Styx originally P5 (discovered 2012) official designations S/2011 (134340) 1 and S/2012 (134340) 1." }
    ]
  }
};
