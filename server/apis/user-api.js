const exp=require('express')
const userApp=exp.Router()
const expressAsyncHandler=require('express-async-handler');


require('dotenv').config();
//body parser
userApp.use(exp.json())

let userCollectionObj;

userApp.use((req,res,next)=>{
    userCollectionObj=req.app.get('userCollection');
    next();
})


//SAVE USER DATA TO DB
userApp.post('/saveUser',expressAsyncHandler(async(req,res)=>{
    let newUser=req.body;
    try{
        let response=await userCollectionObj.insertOne({...newUser}); 
        return res.send({message:"User created"})
    }catch(err){
        console.log(err);
        return res.send({message:"User not created"})
    }
}));



module.exports=userApp;