/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-14 11:31:09
*/
const Router = require('express').Router;
const CategoryModel = require('../models/category.js');
const ArticleModel = require('../models/article.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const getCommonData = require('../util/getCommonData.js');
const router = Router();

//显示首页
router.get("/",(req,res)=>{
	ArticleModel.getPaginationArticles(req)
	.then(pageData=>{
		getCommonData()
		.then(data=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				articles:pageData.docs,
				page:pageData.page,
				list:pageData.list,
				pages:pageData.pages,
				categories:data.categories,
				topArticles:data.topArticles,
				site:data.site,
				url:'/articles'
			});				
		})
	})
})

//ajax请求获取文章列表的分页数据
router.get("/articles",(req,res)=>{
	let category = req.query.id;
	let query = {};
	if(category){
		query.category = category;
	}
	ArticleModel.getPaginationArticles(req,query)
	.then((data)=>{
		res.json({
			code:'0',
			data:data
		})
	})
});

//显示详情页面
router.get("/view/:id",(req,res)=>{
	let id = req.params.id;
	ArticleModel.findByIdAndUpdate(id,{$inc:{click:1}},{new:true})
	.populate('category','name')
	.then(article=>{
		getCommonData()
		.then(data=>{
			CommentModel.getPaginationComments(req,{article:id})
			.then(pageData=>{
				res.render('main/detail',{
					userInfo:req.userInfo,
					article:article,
					categories:data.categories,
					topArticles:data.topArticles,
					comments:pageData.docs,
					page:pageData.page,
					list:pageData.list,
					pages:pageData.pages,
					site:data.site,
					category:article.category._id.toString()
				})			      	
			})
		})
	})
})

//显示列表页面
router.get("/list/:id",(req,res)=>{
	let id = req.params.id;
	ArticleModel.getPaginationArticles(req,{category:id})
	.then(pageData=>{
		getCommonData()
		.then(data=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				articles:pageData.docs,
				page:pageData.page,
				list:pageData.list,
				pages:pageData.pages,
				categories:data.categories,
				topArticles:data.topArticles,
				category:id,
				site:data.site,
				url:'/articles'
			});	

		})
	})

})

module.exports = router;