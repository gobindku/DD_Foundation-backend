const {Schema,model} = require("mongoose");

const imageSchema = new Schema({
    Path:{type:String,required:true},
    filename:{type:String,required:true}
});

const Image = new model('image', imageSchema);
module.exports = Image;
