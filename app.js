require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');

const app=express();
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});


const userSchema=new mongoose.Schema({//encryption
  email:String,
  password:String
});
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt,{ secret: process.env.API_KEY,encryptedFields: ["password"] });
const User=new mongoose.model("User",userSchema);


const user=new User({
  email:"buenhomber@gmail.com",
  password:"asdfghjkl"
});


user.save();

app.listen(3000,function(){


  console.log("server started on 3000");
})
//jshint esversion:6
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){

console.log(req.body);

const user=new User({
  email:req.body.username,
  password:req.body.password
});
user.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
  }
});

});


app.get("/submit",function(req,res){

res.render("submit");


});


app.post("/login",function(req,res){
  const username=req.body.username;
  const pass=req.body.password;



  User.findOne({email:username},function(err,found){
      if(err){
      console.log(err);
      res.send("no user found")
    }
            if(found){
                console.log("username found");
                if(found.password===pass){
                  console.log("sucess");
                  res.render("secrets");
                }else{
                  res.send("wrong pass word");

                }


              }
              else{
                console.log("no user found");
                res.send("no user found")
              }








  })
})
