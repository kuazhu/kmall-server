/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-13 10:54:31
*/
const Router = require('express').Router;
const CommentModel = require('../models/comment.js')

const router = Router();

//添加评论
router.post("/add",(req,res)=>{
	let body = req.body;
	new CommentModel({
		article:body.id,
		user:req.userInfo._id,
		content:body.content
	})
	.save()
	.then(comment=>{
		CommentModel.getPaginationComments(req,{article:body.id})
		.then(data=>{
			res.json({
				code:0,
				data:data
			});			
		})
	})
})

router.get('/list',(req,res)=>{
	let article = req.query.id;
	let query = {};
	if(article){
		query.article = article;
	}
	CommentModel.getPaginationComments(req,query)
	.then((data)=>{
		res.json({
			code:'0',
			data:data
		})
	})
})


module.exports = router;