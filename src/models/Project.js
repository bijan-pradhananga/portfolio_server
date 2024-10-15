const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    link:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
    },
    image: {
        type: String,
        required:true
    },
    
},{timestamps:true});

const Project = mongoose.model('Project',projectSchema);
module.exports = Project;