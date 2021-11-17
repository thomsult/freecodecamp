// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

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
