const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongodb = require('mongodb')
const MongoClient= require('mongodb').MongoClient
const path = require('path')


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
   
    //we can access anything in browser without creating api's which are present inside public folder
    app.use('/public', express.static(path.join(__dirname, '/public')))

    //------------- creating APIs --------------
    
    //send some html data 
    app.get('/', function(req,res, next){
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <center><h1 style="color:blue;">Hello guys!!</h1></center>
        </body>
        </html>`)
    })

    //another way -- whnever we have lrge html code, so we can use this way
    app.get('/welcome', function(req,res, next){
        res.sendFile(path.join(__dirname, '/welcome.html'))
    })

    
    



    //create server
    const port = 8000
    app.listen(port, function(){
        console.log(`Server is running at port ${port}`)
    })

})






