const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  office: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  district: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  issues: {
    type: [String],
    default: [],
  },
  tags: {
    type: String,
    default: '',
},  
});

const Fighter = mongoose.models.Fighter || mongoose.model('Fighter', fighterSchema);
module.exports = Fighter;