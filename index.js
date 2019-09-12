// Import Packages

const connection = require('./connection')
const app = require('./app')
const fun = require('./functions/encrypted')
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


const url = 'mongodb://localhost:27017'

MongoClient.connect(url, {useNewUrlParser:true,useUnifiedTopology: true}, (err, client) => {
    
    if(err)
    console.log('Unable to connect to the mongoDB server.Error', err);
    else{

        // Create EndPoint Services

        app.post('/register', (req, resp, next) =>{

            const postData = req.body
            const plaintPassword = postData.password
            const hashData = fun.saltHashPassword(plaintPassword)
        
            const password = hashData.passwordHash
            const salt = hashData.salt
        
            const name = postData.name
            const email = postData.email
            const db = client.db('mydb')
        
            const insertJson = {
                'email':email,
                'password': password,
                'salt':salt,
                'name':name
            };

            
            db.collection('user')
                .find({'email':email}).count((err,number) => {
                    if(number != 0)
                    {
                        resp.json('Email already exists')
                        console.log('Email already exists')
                    }
                    else
                    {
                        db.collection('user')
                            .insertOne(insertJson, (error, response) => {
                                resp.json('Resgistration success')
                                console.log('Resgistration success')
                            })
                    }
                })
        
        })
        
        app.post('/login', (req, resp, next) => {
        
                const postData = req.body
                const email = postData.email
                const userPassword = postData.password

                const db = client.db('mydb')

                db.collection('user')
                    .find({'email': email}).count((err,number) => {
                        if(number == 0)
                        {
                            resp.json('Email not exists')
                            console.log('Email not exists')
                        }
                        else
                        {
                            db.collection('user')
                            .findOne({'email':email}, (err, user) => {

                                const salt = user.salt
                                const hashedPassword = fun.checkHashPassword(userPassword,salt).passwordHash
                                const encryptedPassword = user.password
        
                                if(hashedPassword == encryptedPassword)
                                {
                                    resp.json('Login Success')
                                    console.log('Login Success')
                                }
                                else
                                {
                                    resp.json('Email or Password incorrect')
                                    console.log('Email or Password incorrect')
                                }
                            })
                        }
                    })
            })

         app.listen(3001, ()=>{
            console.log('Connected to MogoDB server, Service run on port 3001');
        })
    }
})



