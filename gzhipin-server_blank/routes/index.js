const md5=require('blueimp-md5')
const UserModel=require('../db/db.models').UserModel//引入UserModel
const ChatModel=require('../db/db.models').ChatModel//引入ChatModel
const filter={password:0}//过滤密码
var express = require('express');
var router = express.Router();
//注册路由
router.post('/register', function(req, res, next) {
  const {username,password,type}=req.body
  UserModel.findOne({username},function(err,user){
    if(user){
      res.send({code:1,msg:'此用户已经存在'})
    }else{
      new UserModel({username,password:md5(password),type}).save(function(err,user){
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
      res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })
 
});
 
router.post('/login',function(req,res){
  const {username,password}=req.body
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(!user){
      res.send({code:1,msg:'密码错误'})
    }else{
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
      res.send({code:0,data:user})
    }
  })

})
router.post('/update',function(req,res){
  const userid=req.cookies.userid
  console.log("req.body",req.body)
  if(!userid){
    return res.send({code:1,msg:'请先登录'})
  }
  UserModel.findByIdAndUpdate({_id:userid},req.body,function(err,user){
    console.log("update",err)
    const{_id,username,type}=user
    const data=Object.assign(req.body,{_id,username,type})
    res.send({code:0,data})
  })
})
// 根据cookie 获取对应的user
router.get('/user', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({code: 1,msg: "请先登陆"})
  }
  UserModel.findOne({_id:userid},filter,function(req,user){
    return res.send({code:0,data:user})
  })
})
router.get('/list',function(req,res){
  const {type}=req.query
  UserModel.find({type},function(err,users){
    return res.json({code:0,data:users})
  })

})
/*
获取当前用户所有相关聊天信息列表
*/
router.get('/msglist',function(req,res){
  //获取cookie中的userid
  const userid=req.cookies.userid
  //查询得到所有user的文档数组
  UserModel.find(function(err,userDocs){
    //用对象储存所有user信息：key为user的_id，val为name和header组成的user对象
    const users={}//对象容器
    userDocs.forEach(doc=>{
      users[doc._id]={username:doc.username,header:doc.header}
    })
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function(err,chatMsgs){
      //返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code:0,data:{users,chatMsgs}})
    })
  })
 
})
/*
修改指定消息为已读
*/
router.post('/readmsg',function(req,res){
// 得到请求中的from 和to
const from=req.body.from
const to=req.cookies.userid
/*
更新数据库中的chat 数据
参数1: 查询条件
参数2: 更新为指定的数据对象
参数3: 是否1 次更新多条, 默认只更新一条
参数4: 更新完成的回调函数
*/



ChatModel.update({from,to,read:false},{read:true},{multi:true},function(err,doc){
    res.send({code:0,data:doc.nModified})//更新的数量
  })
})

module.exports = router;
