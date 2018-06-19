var mongoose = require('mongoose');  
var projectsSchema = new mongoose.Schema({  
  title: String,
  description: String,
  location: String,
  start: { type: Date, default: Date.now },
  end: { type: Date, default: Date.now },
  creator_id: String,
  workers: {type: String, default: ''},
});
mongoose.model('Project', projectsSchema);