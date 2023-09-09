const express = require('express');
const app  =  express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const UrlModel = require('./models/linkdb');
const qrcode = require('qrcode');
require('dotenv').config();
mongoose.set('strictQuery', false)


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
app.get('/qrcode/:id', async (req, res) => {
    try {
      const shortUrl = req.params.id;
  
      // Find the URL in the database by short URL
      const url = await UrlModel.findOne({ shortUrl: shortUrl });
  
      if (url) {
        // Generate a QR code for the long URL
        const qrCodeData = url.longUrl; // Use the long URL directly
        const qrCodeUrl = await generateQRCode(qrCodeData);
        res.render('createqr', {
          shortUrl: url.shortUrl,
          qrCodeUrl: qrCodeUrl,
          longUrl: url.longUrl, // Pass the long URL for redirection
        });
      
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
  async function generateQRCode(data) {
    try {
      const qrCodeUrl = await qrcode.toDataURL(data);
      return qrCodeUrl;
    } catch (err) {
      throw err;
    }
}
  
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
//delete
app.post('/delete/:id', async (req, res) => {
    try {
      const shortUrl = req.params.id;
  
      // Find the URL in the database by short URL
      const url = await UrlModel.findOne({ shortUrl: shortUrl });
  
      if (url) {
        // Delete the URL from the database
        await url.remove();
        res.redirect('/');
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
})

app.listen(process.env.PORT || 3000,function(){
    console.log('Port running 3000')
});