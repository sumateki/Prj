const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongodb = require('mongodb')
const MongoClient= require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const jwtSecretKey = "MyNameisSuma!@#$%"

const url= 'mongodb://localhost:27017'
const dbName= 'Todo'

MongoClient.connect(url, (err, data)=>
{
    if(err)
    {
        return console.log(err)
    }
    console.log('Connected successfully')
    const db= data.db(dbName)


    //tell express to use body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json({limit: '110mb'}))
    app.use(cookieParser())


    //------------- creating APIs --------------
    //get
    app.get('/', function(req,res, next){
        res.send('Hello World')
    })

     // --------- REGISTER ----------
     app.post("/register", function(req, res, next){
        let user = req.body
        db.collection("Users").insertOne(user, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({error: 'Failed to insert user data'})
            }
            res.json({result: "Inserted Successfully"})
        })    
    })


    //-------- LOGIN--------------
    app.post('/login', function(req,res,next){
        let {email, password} = req.body
        db.collection("Users").findOne({email: email, password: password}, function(err, user){
            if(err){
                console.log(err)
                return res.status(500).json({error: 'Internl server error'})
            }
            //if user not found
            if(!user){
                return res.json({result: "Login Failed!!", code: 0})
            }
            //if user found then create token
            else{
                // let jwtSecretKey = "MyNameisSuma!@#$%"
                let data = {
                    loginTimeStamp: new Date(),
                    user_email: email,
                    id: user._id,
                    gender: user.gender
                }
                const token = jwt.sign(data, jwtSecretKey)
                res.cookie("login_token", token)
                res.json({result: "Login Successfully!!", code: 1})
            }        
        })  
    })

    //------ LOGOUT ----------
    app.get("/logout", function(req, res, next){
        res.clearCookie("login_token")
        res.json({result: "Logged out successfully", code: 1})
            
    })

    //middleware for authenticating the api's
    app.use(function(req,res,next){
        let cookies = req.cookies
        if(!cookies.login_token) return res.json({message: "No token found."})
        const verified = jwt.verify(cookies.login_token, jwtSecretKey)
        if(verified){
            next()
        }
        else{
            res.json({message: "Invalid Token!!"})
        } 
    })


    app.get('/getTask', function(req, res, next){
        db.collection("Tasks").find().toArray(function(err, tasks){
            if(err){
                console.log(err);
                return res.status(500).json({ error: 'Failed to fetch data' });
            }
            res.json({ result: "Successfully getting the data", data:tasks })
        })     
    })


    app.post("/createTask", function(req, res, next){
        let task = req.body
        db.collection("Tasks").insertOne(task, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({error: 'Failed to insert document'})
            }
            res.json({result: "Inserted Successfully", code: 1})
        })
             
    })


    app.post('/updateTask', function(req, res, next){
        let { taskid, updatedTask } = req.body;
        // Check if taskid is a valid ObjectId
        if (!mongodb.ObjectId.isValid(taskid)) {
            return res.status(400).json({ error: 'Invalid taskid' });
        }
        db.collection("Tasks").updateOne({ _id: new mongodb.ObjectId(taskid) }, { "$set": updatedTask }, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to update document' })
            }
            res.json({ result: "Updated Successfully" })
        })
    })



    app.post('/deleteTask', function(req, res, next){  
        let taskid = req.body.taskid
        // Check if taskid is a valid ObjectId
        if (!mongodb.ObjectId.isValid(taskid)) {
            return res.status(400).json({ error: 'Invalid taskid' });
        }
        db.collection("Tasks").deleteOne({ _id: new mongodb.ObjectId(taskid) }, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to update document' })
            }
            res.json({ result: "Deleted Successfully" })
        })
    })

    
   

    //create server
    const port = 8000
    app.listen(port, function(){
        console.log(`Server is running at port ${port}`)
    })

})






