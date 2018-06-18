var mongoose = require('mongoose');  
var projectsSchema = new mongoose.Schema({  
  title: String,
  description: String,
  price: Number,
  work: String,
  start: { type: Date, default: Date.now },
  end: { type: Date, default: Date.now },
  creator_id: String,
  workers: {type: String, default: ''},
  work_done: {type: String, default: ''},
  archived: {type: Boolean, default: false},
});
mongoose.model('Project', projectsSchema);