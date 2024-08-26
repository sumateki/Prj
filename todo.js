const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const mongodb = require('mongodb')
const MongoClient= require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const jwtSecretKey = "MyNameisSuma!@#$%"
const {ObjectId} = mongodb


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


    //middleware setup --- tell express to use body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json({limit: '110mb'}))
    app.use(cookieParser())

    app.set('views', path.join(__dirname, 'public/views'))
    app.set('view engine', 'ejs')  // Set EJS as the view engine

    app.use(express.static(path.join(__dirname, 'public')))

    //-------------Routes -- creating APIs --------------
    //get
    app.get('/', function(req,res, next){
        res.sendFile(path.join(__dirname, 'public', 'todo.html'))
    })

    // --------- REGISTER ----------
    app.post("/register", function(req, res, next){
        let user = req.body

        db.collection("Users").findOne({ $or: [{email: user.email}, {phone: user.phone}] }, function(err, existingUser){
            if(err){
                console.log(err)
                return res.status(500).json({error: 'Internal server error'})
            }
            if(existingUser){
                if(existingUser.email === user.email){
                    return res.json({ error: 'Email is already registered. Please go to Login page!!'})
                }
                if(existingUser.phone === user.phone){
                    return res.json({ error: 'Phone number is already registered.'})
                }
            }

            db.collection("Users").insertOne(user, function(err, result){
                if(err){
                    console.log(err)
                    return res.status(500).json({error: 'Failed to insert user data'})
                }
                res.json({result: "User Registered Successfully"})
            }) 
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
                return res.json({result: "Login Successfully!!", code: 1})
                
            }        
        })  
    })

    // ------- TASKSLIST ----------------

    app.get('/tasksList', function(req,res){
        if(req.cookies.login_token){
            res.sendFile(path.join(__dirname, 'public/todo', 'tasksList.html'))
        }
        else{
            res.redirect('/login.html')
        }
    })

    //middleware for authenticating the api's
    app.use(function(req,res,next){
        let cookies = req.cookies
        if(!cookies.login_token) return res.json({message: "No token found."})
        const verified = jwt.verify(cookies.login_token, jwtSecretKey)
        if(verified){
            req.user = verified
            next()
        }
        else{
            res.json({message: "Invalid Token!!"})
        } 
    })


    //------ LOGOUT ----------
    app.get("/logout", function(req, res, next){
        res.clearCookie("login_token")
        res.json({result: "Logged out successfully", code: 1})
        res.redirect('/todo/login')      
    })

    
    app.get('/getTask', function(req, res, next){
        let user = req.user
        db.collection("Tasks").find({user_id : new ObjectId(user.id)}).toArray(function(err, tasks){
            if(err){
                console.log(err);
                return res.status(500).json({ error: 'Failed to fetch data' });
            }
            // res.json({ result: "Successfully getting the data", data:tasks })
            res.render('getTask', { tasks: tasks })  // Render getTask.ejs
        })     
    })

    
    app.post("/createTask", function(req, res, next){
        let user = req.user
        let task = req.body
        task['user_id'] = new ObjectId(user.id)
        db.collection("Tasks").insertOne(task, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({error: 'Failed to insert document'})
            }
            res.json({result: "Task Created Successfully", code: 1})
        })
             
    })


    app.post('/updateTask', function(req, res, next){
        let user = req.user
        let { taskid, updatedTask } = req.body;

        console.log(updatedTask);
        
        // Check if taskid is a valid ObjectId
        if (!mongodb.ObjectId.isValid(taskid)) {
            return res.status(400).json({ error: 'Invalid taskid' });
        }
        db.collection("Tasks").updateOne({ _id: new mongodb.ObjectId(taskid), user_id : new ObjectId(user.id) }, { $set: updatedTask }, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to update document' })
            }
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Task not found or you are not authorized to update this task' });
            }
            res.json({ result: "Updated Successfully" })
        })
    })



    app.post('/deleteTask', function(req, res, next){  
        let user = req.user
        let taskid = req.body.taskid

        // Check if taskid is a valid ObjectId
        if (!mongodb.ObjectId.isValid(taskid)) {
            return res.status(400).json({ error: 'Invalid taskid' });
        }
        db.collection("Tasks").deleteOne({ _id: new mongodb.ObjectId(taskid), user_id : new ObjectId(user.id) }, function(err, result){
            if(err){
                console.log(err)
                return res.status(500).json({ error: 'Failed to update document' })
            }
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Task not found or you are not authorized to delete this task' });
            }
            res.json({ result: "Deleted Successfully" })
        })
    })

    
   
    //create server
    // const port = 8000
    // app.listen(port, function(){
    //     console.log(`Server is running at port ${port}`)
    // })
    const port = process.env.PORT || 8000;
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running at http://localhost:${port}`);
    });


})
