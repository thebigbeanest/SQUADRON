const mongoose = require('mongoose');
const { Enemy, Faction, Location, Lore, Ship } = require('../Models');

mongoose.connect('mongodb://127.0.0.1:27017/squadronDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

const resetCollections = async () => {
  try {
    await Enemy.deleteMany({});
    await Faction.deleteMany({});
    await Location.deleteMany({});
    await Lore.deleteMany({});
    await Ship.deleteMany({});
    console.log('All collections reset');
  } catch (error) {
    console.error('Error resetting collections:', error);
  }
};

const seedData = async () => {
  const factions = [
    { name: 'United Federation', description: 'The United Federation is a multinational organization / superpower born out of the North Atlantic Treaty Alliance (NATO).', status: 'AT WAR', image: 'UF.png' },
    { name: 'Red Star Alliance', description: 'The Red Star Alliance is a large and powerful bloc of satellite states surrounding the main leader, the Soviet Union, that comprises Eastern Europe, Russia, and the Middle East.', status: 'AT WAR', image: 'RSA.png' }
  ];

  try {
    await resetCollections();

    // Seed factions first
    const seededFactions = await Faction.insertMany(factions);
    console.log('Factions seeded');

    // Create the other data arrays using the seeded factions' _id
    const ships = [
      { allegiance: seededFactions[0]._id, description: 'A mid-sized Federation escort frigate intended to delay larger cruisers and destroy smaller vessels.', image: 'warship.png', health: 2000, name: 'PH-78-Class Frigate' },
      { allegiance: seededFactions[0]._id, description: 'A new, experimental, and agile interceptor deployed out of the Dorado Nuclear Range in order to protect the Horizon facility.', image: 'playership.png', health: 500, name: 'PI-90 Quarterhouse' },
      { allegiance: seededFactions[0]._id, description: 'Multirole orbital defense craft, with nuclear pulse propulsion and heavy weapons systems. The mainstay of the deep space bombardment force.', image: 'playerAllyLarge.png', health: 4000, name: 'ODC2-DEFENDER' }
    ];

    const enemies = [
      { name: 'Oscar Class Gunship', description: 'A light cruiser currently in use by the RSA, sporting heavy armor and firepower at the cost of maneuverability.', image: 'largeenemy.png', health: 5000, allegiance: seededFactions[1]._id },
      { name: 'Olympic Class Silocraft', description: 'A ballistic missile vessel currently in use by the RSA. Sacrifices armor and maneuverability in exchange for massive missile payloads and nuclear capability.', image: 'silocraft.png', health: 3400, allegiance: seededFactions[1]._id },
      { name: 'Sierra Class Fighter', description: 'An outdated reserve fighter hastily put into service by the RSA at the outbreak of the Lunar War. Retains moderate agility but is very fragile.', image: 'enemysmall.png', health: 150, allegiance: seededFactions[1]._id }
    ];

    const locations = [
      { name: 'Horizon', allegiance: seededFactions[0]._id, description: 'CLASSIFIED', functional: false, purpose: 'CLASSIFIED', population: 0 },
      { name: 'Dorado Nuclear Range', allegiance: seededFactions[0]._id, description: 'A large multi-functional military installation with nuclear silos and interceptor craft to defend UF interests in the Lunar South Pole region.', functional: true, purpose: 'Military', population: 5271 }
    ];

    const lore = [
      { allegiance: seededFactions[0]._id, description: 'The history of the United Federation.', image: 'uf_lore.png' },
      { allegiance: seededFactions[1]._id, description: 'The story of the Red Star Alliance.', image: 'rsa_lore.png' }
    ];

    // Seed the other collections
    await Ship.insertMany(ships);
    console.log('Ships seeded');

    await Enemy.insertMany(enemies);
    console.log('Enemies seeded');

    await Location.insertMany(locations);
    console.log('Locations seeded');

    await Lore.insertMany(lore);
    console.log('Lore seeded');

  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

const run = async () => {
  await seedData();
  mongoose.connection.close();
};

run();