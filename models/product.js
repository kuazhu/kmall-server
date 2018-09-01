/*
* @Author: TomChen
* @Date:   2018-08-04 17:14:00
* @Last Modified by:   TomChen
* @Last Modified time: 2018-09-01 10:14:18
*/
const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');

const ProductSchema = new mongoose.Schema({
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  detail:{
  	type:String
  },
  description:{
    type:String
  },
  images:{
    type:String
  },
  price:{
    type:Number
  }, 
  stock:{
    type:Number
  },
  name:{
    type:String
  },
  status:{
    type:String,
    default:'0'//0-在售 1-下架
  },     
  order:{
  	type:Number,
    default:0
  },
},{
  timestamps:true
});

ProductSchema.statics.getPaginationProducts = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,
        model:this, 
        query:query, 
        projection:'name _id price status order',
        sort:{order:-1}, 
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;