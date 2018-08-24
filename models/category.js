/*
* @Author: TomChen
* @Date:   2018-08-04 17:14:00
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-07 17:26:34
*/
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name:{
  	type:String
  },
  order:{
  	type:Number,
    default:0
  },

});


const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;