// server.js
// where your node app starts
var dates = new Date();

const objTemplate = {

    unix:	dates.getTime(),
    utc:	dates.toUTCString()
}
const error = { error : "Invalid Date" };
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
app.get('/api/:date',(req, res) => {
  console.log(req.params)
  if(req.params.date.length > 0){
      if(req.params.date.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)){
          var params = req.params.date;
          var date = new Date(params)
          res.json({
              unix:	date.getTime(),
              utc:	date.toUTCString()
          })
      }
      else if(req.params.date.match(/^(\d){1,}$/)){
          


          var params = parseInt(req.params.date);
          console.log(params)
          var date = new Date(params)

          if(date.toString() != 'Invalid Date'){
          res.json({
              unix:	date.getTime(),
              utc:	date.toUTCString()
          })}
          else{
              res.json(error)
              console.log(error)
          }
      }
      else{
          res.json(error)
          console.log(error)
      }
      
  }
})
app.get('/api/',(req, res) => {
  res.json(objTemplate)

});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
