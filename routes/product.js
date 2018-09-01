/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-09-01 11:42:37
*/
const Router = require('express').Router;
const ProductModel = require('../models/product.js');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/product-images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const router = Router();

//权限控制
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send({
			code:10
		});
	}
})

//处理商品图片
router.post("/uploadImage",upload.single('file'),(req,res)=>{
	const filePath = 'http://127.0.0.1:3000/product-images/'+req.file.filename;
	res.send(filePath);
	
})
//处理商品详情图片
router.post("/uploadDetailImage",upload.single('upload'),(req,res)=>{
	const filePath = 'http://127.0.0.1:3000/product-images/'+req.file.filename;
	res.json({
		  "success": true,
		  "msg": "上传成功",
		  "file_path": filePath
	});
})

//添加商品
router.post("/",(req,res)=>{
	let body = req.body;
	new ProductModel({
		name:body.name,
		category:body.category,
		detail:body.detail,
		description:body.description,
		images:body.images,
		price:body.price,
		stock:body.stock
	})
	.save()
	.then((product)=>{
		if(product){
			res.json({
				code:0,
				message:'新增商品成功'
			})
		}
	})
	.catch((e)=>{
 		res.json({
 			code:1,
 			message:"添加分类失败,服务器端错误"
 		})
	})
})

//获取商品
router.get("/",(req,res)=>{
	let page = req.query.page || 1;
	ProductModel
	.getPaginationProducts(page,{})
	.then((result)=>{
		res.json({
			code:0,
			data:{
				current:result.current,
				total:result.total,
				pageSize:result.pageSize,
				list:result.list					
			}
		})	
	})
	.catch((e)=>{
 		res.json({
 			code:1,
 			message:"获取分类失败,服务器端错误"
 		})
	})		
});
//更新排序
router.put("/updateOrder",(req,res)=>{
	let body = req.body;
	ProductModel
	.update({_id:body.id},{order:body.order})
	.then((product)=>{
		if(product){
			ProductModel
			.getPaginationProducts(body.page,{})
			.then((result)=>{
				res.json({
					code:0,
					data:{
						current:result.current,
						total:result.total,
						pageSize:result.pageSize,
						list:result.list					
					}
				})	
			})					
		}else{
	 		res.json({
	 			code:1,
	 			message:"更新排序失败,数据操作失败"
	 		})					
		}
	})
})

//更新排序
router.put("/updateStatus",(req,res)=>{
	let body = req.body;
	ProductModel
	.update({_id:body.id},{status:body.status})
	.then((product)=>{
		if(product){
			res.json({
				code:0,
				message:'更新状态成功'
			})					
		}else{
			ProductModel
			.getPaginationProducts(body.page,{})
			.then((result)=>{
				res.json({
					code:1,
					message:'更新状态失败',
					data:{
						current:result.current,
						total:result.total,
						pageSize:result.pageSize,
						list:result.list					
					}
				})	
			})							
		}
	})
})
module.exports = router;