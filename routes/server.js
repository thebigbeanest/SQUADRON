const express = require('express');
const router = express.Router();
const { Enemy, Faction, Location, Lore, Ship } = require('../Models');

// Handle the search request
router.get('/', async (req, res) => {
    const query = req.query.query;
    try {
        const enemyResults = await Enemy.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        const factionResults = await Faction.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        const locationResults = await Location.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        const loreResults = await Lore.find({
            $or: [
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        const shipResults = await Ship.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        const results = [
            ...enemyResults,
            ...factionResults,
            ...locationResults,
            ...loreResults,
            ...shipResults
        ];

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;