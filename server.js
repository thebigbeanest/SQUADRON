const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const db = require('./db');
const { Enemy, Faction, Location, Lore, Ship } = require('./Models');

const app = express();

// Allow requests from http://127.0.0.1:5500
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Welcome');
});

// Enemy routes
app.get('/enemy', async (req, res) => {
  const enemies = await Enemy.find({});
  res.json(enemies);
});

app.get('/enemy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const enemy = await Enemy.findById(id);
    if (!enemy) throw Error('Enemy not found');
    res.json(enemy);
  } catch (e) {
    console.log(e);
    res.send('404 Enemy not found');
  }
});

app.post('/enemy', async (req, res) => {
  try {
    const newEnemy = await Enemy.create(req.body);
    res.status(201).json({ message: 'Enemy created successfully', newEnemy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/enemy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEnemy = await Enemy.deleteOne({ _id: id });
    if (deletedEnemy.deletedCount === 0) {
      return res.status(404).json({ error: 'Enemy not found' });
    }
    res.json({ message: 'Enemy deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Faction routes
app.get('/faction', async (req, res) => {
  const factions = await Faction.find({});
  res.json(factions);
});

app.get('/faction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const faction = await Faction.findById(id);
    if (!faction) throw Error('Faction not found');
    res.json(faction);
  } catch (e) {
    console.log(e);
    res.send('404 Faction not found');
  }
});

app.post('/faction', async (req, res) => {
  try {
    const newFaction = await Faction.create(req.body);
    res.status(201).json({ message: 'Faction created successfully', newFaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/faction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaction = await Faction.deleteOne({ _id: id });
    if (deletedFaction.deletedCount === 0) {
      return res.status(404).json({ error: 'Faction not found' });
    }
    res.json({ message: 'Faction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Location routes
app.get('/location', async (req, res) => {
  const locations = await Location.find({});
  res.json(locations);
});

app.get('/location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) throw Error('Location not found');
    res.json(location);
  } catch (e) {
    console.log(e);
    res.send('404 Location not found');
  }
});

app.post('/location', async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json({ message: 'Location created successfully', newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLocation = await Location.deleteOne({ _id: id });
    if (deletedLocation.deletedCount === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Lore routes
app.get('/lore', async (req, res) => {
  const lores = await Lore.find({});
  res.json(lores);
});

app.get('/lore/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lore = await Lore.findById(id);
    if (!lore) throw Error('Lore not found');
    res.json(lore);
  } catch (e) {
    console.log(e);
    res.send('404 Lore not found');
  }
});

app.post('/lore', async (req, res) => {
  try {
    const newLore = await Lore.create(req.body);
    res.status(201).json({ message: 'Lore created successfully', newLore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/lore/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLore = await Lore.deleteOne({ _id: id });
    if (deletedLore.deletedCount === 0) {
      return res.status(404).json({ error: 'Lore not found' });
    }
    res.json({ message: 'Lore deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ship routes
app.get('/ship', async (req, res) => {
  const ships = await Ship.find({});
  res.json(ships);
});

app.get('/ship/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ship = await Ship.findById(id);
    if (!ship) throw Error('Ship not found');
    res.json(ship);
  } catch (e) {
    console.log(e);
    res.send('404 Ship not found');
  }
});

app.post('/ship', async (req, res) => {
  try {
    const newShip = await Ship.create(req.body);
    res.status( 201).json({ message: 'Ship created successfully', newShip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/ship/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShip = await Ship.deleteOne({ _id: id });
    if (deletedShip.deletedCount === 0) {
      return res.status(404).json({ error: 'Ship not found' });
    }
    res.json({ message: 'Ship deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Game code
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required.' });
  }

  try {
    const enemyResults = await Enemy.find({ name: new RegExp(query, 'i') });
    const factionResults = await Faction.find({ name: new RegExp(query, 'i') });
    const locationResults = await Location.find({ name: new RegExp(query, 'i') });
    const loreResults = await Lore.find({ title: new RegExp(query, 'i') });
    const shipResults = await Ship.find({ name: new RegExp(query, 'i') });

    const results = {
      enemies: enemyResults,
      factions: factionResults,
      locations: locationResults,
      lores: loreResults,
      ships: shipResults
    };

    res.json(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
