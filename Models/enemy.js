const { Schema } = require('mongoose');

const enemySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    health: { type: Number, required: true, default: true },
    image: { type: String, required: true },
    allegiance: { type: Schema.Types.ObjectId, ref: 'Faction' }
  },
  { timestamps: true }
);

module.exports = enemySchema