/*
* @Author: TomChen
* @Date:   2018-08-04 17:14:00
* @Last Modified by:   TomChen
* @Last Modified time: 2018-09-11 17:11:03
*/
const mongoose = require('mongoose');
const ProductModel = require('./product.js');
const CartItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    count:{
        type:Number,
        default:1
    },
    totalPrice:{
        type:Number,
        default:0
    },
    checked:{
        type:Boolean,
        default:true
    }
});

const CartSchema = new mongoose.Schema({
  cartList:{
    type:[CartItemSchema]
  },
  allChecked:{
    type:Boolean,
    default:true
  },
  totalCartPrice:{
    type:Number,
    default:0
  }
})

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
  },
  cart:{
    type:CartSchema
  }
},{
  timestamps:true
});

UserSchema.methods.getCart = function(){
    return new Promise((resolve,reject)=>{
        //如果没有购物车信息返回空对象
        if(!this.cart){
            resolve({
                cartList:[]
            });
        }
        //获取购物车项目的promise
        let getCartItems = this.cart.cartList.map(cartItem=>{
                return  ProductModel
                        .findById(cartItem.product,"name price stock images _id")
                        .then(product=>{
                            cartItem.product = product;
                            cartItem.totalPrice = product.price * cartItem.count
                            return cartItem
                        })
        })
        
        Promise.all(getCartItems)
        .then(cartItems=>{
            
            //计算总价格
            let totalCartPrice = 0;
            cartItems.forEach(item=>{
                if(item.checked){
                    totalCartPrice += item.totalPrice
                }
            })
            this.cart.totalCartPrice = totalCartPrice;

            //设置新的购物车列表
            this.cart.cartList = cartItems;
            
            //判断是否有没有选中的项目
            let hasNotCheckedItem = cartItems.find((item)=>{
                return item.checked == false;
            })

            if(hasNotCheckedItem){
                this.cart.allChecked = false;
            }else{
                this.cart.allChecked = true;
            }

            resolve(this.cart);
        })

    });
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;