// 1. 连接数据库
// 1.1. 引入mongoose
var mongoose=require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/bossz')
// 1.3. 获取连接对象
const conn=mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('数据库连接成功')
})
// 2. 定义出对应特定集合的Model 并向外暴露

// 2.1. 字义Schema(描述文档结构)
const userSchema=mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String},
    post:{type:String},
    info:{type:String},
    company:{type:String},
    salary:{type:String}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel=mongoose.model('user',userSchema)
// 2.3. 向外暴露Model
exports.UserModel=UserModel

//定义Chat集合的文档结构
const chatSchema=mongoose.Schema({
    from:{type:String,required:true},//发送用户的id
    to:{type:String,required:true},//接收用户的id
    chat_id:{type:String,required:true},//from 和to组成的字符串
    content:{type:String,required:true},//内容
    read:{type:Boolean,default:false},//标识是否已读
    create_time:{type:Number}//创建时间
})
const ChatModel=mongoose.model('chat',chatSchema)
exports.ChatModel=ChatModel