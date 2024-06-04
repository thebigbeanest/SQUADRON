const { Schema } = require('mongoose');

const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    functional: { type: Boolean, required: true, default: true },
    purpose: { type: String, required: true },
    population: { type: Number, required: true },
    allegiance: { type: Schema.Types.ObjectId, ref: 'Faction' }
  },
  { timestamps: true }
);

module.exports = locationSchema