
const md5=require('blueimp-md5')
// 1.1. 引入mongoose
const mongoose=require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test2')
// 1.3. 获取连接对象
const conn=mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log('db connecte success')
})
// 2. 得到对应特定集合的Model
// 2.1. 字义Schema(描述文档结构)
const userSchema=mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel=mongoose.model('user',userSchema)
// 3. 通过Model 或其实例对集合数据进行CRUD 操作
function testSave(){
    const user1={
        username:'Tom',
        password:md5('1234'),
        type:'dashen',
    }
    const user2={
        username:'mary',
        password:md5('123'),
        type:'laoban',
    }
    const user3={
        username:'jack',
        password:md5('12345'),
        type:'laoban',
    }
    const userModel=new UserModel(user1,user2,user3)
    userModel.save(function(err,data){
        console.log(data)
    })
}
testSave()
// 3.1. 通过Model 实例的save()添加数据
// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
function testFind(){
    UserModel.find(function(err,users){
        console.log('find()',err,users)
    })
}
testFind()
// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
// 3.4. 通过Model 的remove()删除匹配的数据