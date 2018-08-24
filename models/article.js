/*
* @Author: TomChen
* @Date:   2018-08-04 17:14:00
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-11 17:20:52
*/
const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');

const ArticleSchema = new mongoose.Schema({
  category:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Category'
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'User'
  },  
  title:{
  	type:String,
  },
  intro:{
  	type:String,
  },
  content:{
  	type:String,
  }, 
  click:{
  	type:Number,
  	default:0
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  } 
});

ArticleSchema.statics.getPaginationArticles = function(req,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: req.query.page,//需要显示的页码
        model:this, //操作的数据模型
        query:query, //查询条件
        projection:'-__v', //投影，
        sort:{_id:-1}, //排序
        populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }

const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;