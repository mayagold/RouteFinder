const mongoose = require('mongoose');
const Users = require('./users.js');


const routeSchema = mongoose.Schema({
    gpxFile: String,
    description: String,
    userData: [Users.schema],
    details: String,
    likes: { type:Number, default:0 },
    comments: [ {type:String} ],
    commentCount: { type:Number, default:0 }
});

const Routes = mongoose.model('Route', routeSchema);

module.exports = Routes;
