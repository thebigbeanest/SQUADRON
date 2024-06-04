const { Schema } = require('mongoose');

const loreSchema = new Schema(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },
    allegiance: { type: Schema.Types.ObjectId, ref: 'Faction' }
  },
  { timestamps: true }
);

module.exports = loreSchema