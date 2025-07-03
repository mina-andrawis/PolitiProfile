const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  office: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    default: '',
  },
  photoUrl: {
    type: String,
    default: '',
  },
  issues: {
    type: [String],
    default: [],
  },
  endorsements: {
    type: [String],
    default: [],
  },
  quote: {
    type: String,
    default: '',
  },
  donationLink: {
    type: String,
    default: '',
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['incumbent', 'candidate'],
    default: 'candidate',
  },
  runningForReelection: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
  },
  alignmentScore: {
    type: Number,
    default: 0,
  },
});

const Fighter = mongoose.models.Fighter || mongoose.model('Fighter', fighterSchema);
module.exports = Fighter;
