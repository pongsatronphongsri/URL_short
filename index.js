const express = require('express');
const app  =  express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const UrlModel = require('./models/linkdb');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_CONNECT_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
    .then(()=> console.log('connection successfullly'))
    .catch((err)=>console.error(err))


app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.get('/', async function(req, res) {
    try {
        const allUrl = await UrlModel.find();
        res.render('home', {
            UrlResult: allUrl
        });
    } catch (err) {
        console.error(err);
        res.render('home'); // You might want to handle errors differently
    }
});

app.post('/create',function(req,res){
    console.log(req.body.longurl)
    //create a short url
    
    let urlShort = new UrlModel({
        longUrl : req.body.longurl,
        shortUrl : gennerateUrl()
    })
    urlShort.save()
        .then((result)=>{

        })
        .catch((err)=>{
            console.error(err);
        });
        res.redirect('/');
});
app.get('/:urlId', async (req, res) => {
    try {
        const data = await UrlModel.findOne({ shortUrl: req.params.urlId });
        if (data) {
            // Increment the clickCount property
            data.clickCount++;
            await data.save(); // Save the updated data

            res.redirect(data.longUrl);
        } else {
            res.sendStatus(404); // Handle the case where the URL is not found
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Handle errors gracefully
    }
});
function gennerateUrl(){
    var rndResult = "";
    var charecter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charecterLength = charecter.length;

    for(var i =0; i < 5; i++){
        rndResult += charecter.charAt(
            Math.floor(Math.random()*charecterLength)
        );
    }
    console.log(rndResult);
    return rndResult
}

app.listen(3000,function(){
    console.log('Port running 3000')
});