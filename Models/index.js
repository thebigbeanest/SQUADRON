const mongoose = require('mongoose');

// Connect to MongoDB (replace 'yourMongoDBURI' with your actual MongoDB URI)
mongoose.connect('mongodb://127.0.0.1:27017/squadronDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Require schema files
const enemySchema = require('./enemy');
const factionSchema = require('./faction');
const locationSchema = require('./location');
const loreSchema = require('./lore');
const shipSchema = require('./ship');

// Compile models
const Enemy = mongoose.model('Enemy', enemySchema);
const Faction = mongoose.model('Faction', factionSchema);
const Location = mongoose.model('Location', locationSchema);
const Lore = mongoose.model('Lore', loreSchema);
const Ship = mongoose.model('Ship', shipSchema);

// Export models
module.exports = {
  Enemy,
  Faction,
  Location,
  Lore,
  Ship,
};