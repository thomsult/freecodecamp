// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
var shorturlArray = []
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(express.urlencoded({ extended: true }));
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
//api short url
app.post('/api/shorturl',(req, res) =>{
  console.log(req.body.url)
  var url = req.body.url
  var regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  //regex match if url is similar to  http://www.example.com 
  if(url.match(regex)){
    shorturlArray.push(url);
    res.json({ 
      original_url : url, 
      short_url : shorturlArray.indexOf(url)})
  }
  else{
    res.json({ error: 'invalid url' })
    
  }
  
  })
  
app.get('/api/shorturl/:id',(req, res) =>{

  console.log(req.params.id)
  var URLbyid = shorturlArray[req.params.id];
  res.redirect(URLbyid)
})

//api date + whoami
app.get('/api/:date',(req, res) => {
    console.log(req.params.date)

    if(req.params.date ){
      if(req.params.date.match(/^(\d){1,}$/)){
        var dates = new Date(parseInt(req.params.date))
        console.log(dates)
        res.json({"unix":parseInt(req.params.date),"utc":dates.toUTCString()})
      }
      else{
        if(new Date(req.params.date) != "Invalid Date" ){

          var dates = new Date(req.params.date)
          console.log(dates)
          res.json({"unix":dates.getTime(),"utc":dates.toUTCString()})
        }
        else if(req.params.date == 'whoami'){
          res.json({
            ipaddress:	req.ip,
            language:	req.headers["accept-language"],
            software:	req.headers['user-agent']
        
        
          })
        }
        else if(req.params.date == 'shorturl'){
          res.json({requestData:{
            request_param_text:	req.params,
            request_body_text: req.body,
            request_Head_text:	req.headers,
            request_baseUrl:	req.baseUrl},
        
        
          })
        }
        else{
            res.json({ error : "Invalid Date" })
        }
        
      }
        
    }
    
    

})

app.get('/api/',(req, res) => { var dates = new Date()
          console.log(dates+"get/")
          res.json({"unix":dates.getTime(),"utc":dates.toUTCString()})
})







PORT = 3000
// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
