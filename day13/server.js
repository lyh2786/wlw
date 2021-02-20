const express = require("express");
const app = express();
//cros跨域
app.all("*",function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();  
});
//数据库
let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("连接数据库成功");
}).catch((err)=>{
    console.log(err);
})
const userSchema = new mongoose.Schema({
    username:String,
    password:String
})
let user = mongoose.model("userInfor",userSchema);
//url
let url = require("url");
//body-parser
let body_parser=require("body-parser");
app.use(body_parser.urlencoded({
    extended:false
}))


//注册接口
app.get("/register",(req,res)=>{
    let obj=url.parse(req.url,true).query;
    user.find({username:obj.username}).then(data=>{
        if(data.length==0){
            user.create(obj).then(result=>{
                result?res.end("注册成功"):null;
            })
        }else{
            res.send({
                status:false,
                msg:'手机号已经注册过了，请您去登录'
            })
        }
    })
})
//登录接口
app.get("/login",(req,res)=>{
    let obj=url.parse(req.url,true).query;
    user.find({username:obj.username,password:obj.password}).then(data=>{
        data.length==0?res.end("登录失败"):res.end("登录成功");
    })
})
//show接口
app.get("/show",(req,res)=>{
    user.find().then(data=>{
        res.send(data)
    })
})
//增加接口
app.get("/add",(req,res)=>{
    user.create(req.query).then(data=>{
        data?res.send({status:1,msg:"增加成功"}):res.send({status:0,msg:"增加失败"})
    })
})
//修改反显接口
app.get("/editshow",(req,res)=>{
    user.find({_id:req.query.id}).then(data=>{
        res.send(data)
    })
})
//确认修改接口
app.get("/xiugai",(req,res)=>{
    user.updateOne({_id:req.query.id},{email:req.query.email,phone:req.query.phone}).then(data=>{
        data.ok==1?res.send({status:1,msg:"修改成功"}):res.send({status:0,msg:"修改失败"})
    })
})
//删除接口
app.post("/del",(req,res)=>{
    user.findOneAndDelete({_id:req.body.id}).then(data=>{
        data?res.send({status:1,msg:"删除成功"}):res.send({status:0,msg:"删除失败"})
    })
})


//设置监听
app.listen("8080",()=>{
    console.log("8080 is runing");
})
