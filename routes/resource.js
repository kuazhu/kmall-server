/*
* @Author: Tom
* @Date:   2018-08-06 09:23:30
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-13 16:20:20
*/
const Router = require('express').Router;
const path = require('path');
const fs = require('fs');

const ResourceModel = require('../models/resource.js')
const pagination = require('../util/pagination.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/resource/')
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
		res.send('<h1>请用管理员账号登录</h1>');
	}
})

//显示资源列表首页
router.get("/",(req,res)=>{
	 let options = {
        page: req.query.page,//需要显示的页码
        model:ResourceModel, //操作的数据模型
        query:{}, //查询条件
        projection:'-__v', //投影，
        sort:{_id:-1}, //排序
      }
      pagination(options)
      .then(data=>{
		 	res.render('admin/resource_list',{
				userInfo:req.userInfo,
				resources:data.docs,
				page:data.page,
				pages:data.pages,
				list:data.list
			});     	
      })

})

//显示添加资源页面
router.get("/add",(req,res)=>{
	res.render('admin/resource_add',{
		userInfo:req.userInfo
	});
})

//处理新增资源
router.post("/add",upload.single('file'),(req,res)=>{

	new ResourceModel({
		name:req.body.name,
		path:'/resource/'+req.file.filename
	})
	.save()
	.then(resource=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加资源成功',
			url:'/resource'
		})			
	})

})

//处理删除
router.get("/delete/:id",(req,res)=>{
	let id = req.params.id;
	
	ResourceModel.findByIdAndRemove(id)//删除数据库中的记录
	.then(resource=>{
		let filePath = path.normalize(__dirname + '/../public/'+resource.path);
		//删除物理文件
		fs.unlink(filePath,(err)=>{
			if(!err){
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'删除资源成功',
					url:'/resource'
				})					
			}else{
				res.render('admin/error',{
					userInfo:req.userInfo,
					message:'删除资源失败,删除文件错误',
				})					
			}
		})
	})
	.catch(e=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除资源失败,删除数据库记录错误',
		})			
	})

});

module.exports = router;