/*
* @Author: TomChen
* @Date:   2018-08-04 17:14:00
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-27 10:48:12
*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{
  	type:String
  },
  password:{
  	type:String
  },
  isAdmin:{
  	type:Boolean,
  	default:false//默认是普通用户
  },
  email:{
    type:String
  },
  phone:{
    type:String
  }
},{
  timestamps:true
});


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;