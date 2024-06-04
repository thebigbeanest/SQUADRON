const { Schema } = require('mongoose');

const shipSchema = new Schema(
  {
    name: { type: String, required: true },
    health: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    allegiance: { type: Schema.Types.ObjectId, ref: 'Faction' }
  },
  { timestamps: true }
);

module.exports = shipSchema