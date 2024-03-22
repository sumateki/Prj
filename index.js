const express =require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient= require('mongodb').MongoClient

const url= 'mongodb://localhost:27017'
const dbName= 'TODO'

MongoClient.connect(url, (err, data)=>
{
    if(err)
    {
        return console.log(err)
    }
    console.log('Connected successfully')

    const db= data.db(dbName)


    //tell express to use body parser
    // Route handlers inside MongoClient.connect callback
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json({limit: '110mb'}))


    //------------- creating APIs --------------
    //get
    app.get('/', function(req,res, next){
        res.send('Hello World')
    })

    app.get('/register', function(req, res, next){
        res.send("Your registration is successful")
    })
    //get with html
    app.get('/html', function(req, res, next){
        res.send("<center><h1>Using html</h1></enter>")
    })



    //------------ LOGIN -------------
    //get
    app.get('/login', function(req, res, next){
        res.send("Your login is successful, Thanks!!")
    })

    //post
    app.post('/login', function(req, res, next){
        // res.send("Post LOGIN API")
        // res.json(req.body) //data will come
        let {email, password} = req.body
        if(email == 'suma@gmail.com' && password == 'sumateki123')
        {
            res.json({message: "Login succesfully"})
        }
        else{
            res.json({message: "Login Failed"})
        }
        
    })


    //create server
    const port = 8000
    app.listen(port, function(){
        console.log(`Server is running at port ${port}`)
    })

})