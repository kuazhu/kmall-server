/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-09-11 17:04:43
*/
const Router = require('express').Router;
const UserModel = require('../models/user.js');

const router = Router();

//普通用户登录权限控制
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.json({
			code:10
		})
	}
})

//添加购物车
router.post("/",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.count = cartItem.count + parseInt(body.count)
			}else{
				user.cart.cartList.push({
					product:body.productId,
					count:body.count
				})				
			}

		}
		//没有购物车
		else{
			user.cart = {
				cartList:[
					{
						product:body.productId,
						count:body.count
					}
				]
			}
		}
		user.save()
		.then(newUser=>{
			res.json({
				code:0,
				message:'购物车添加成功'
			})
		})
	})
});

//获取购物车信息
router.get('/',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		user.getCart()
		.then(cart=>{
			res.json({
				code:0,
				data:cart
			})			
		})
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'获取购物车失败'
		})
	})	
})


//选中购物车中一项
router.put("/selectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = true
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//取消购物车中一项
router.put("/unselectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = false
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});
module.exports = router;