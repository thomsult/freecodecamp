// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var crypto = require('crypto');
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const { query } = require('express');
var shorturlArray = []
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(express.urlencoded({extended: false}))
// http://expressjs.com/en/starter/static-files.html

app.use(express.static(__dirname +'/views/'));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var LogUser = [];
app.get("/users" , function (req, res) {res.status(200).sendFile(__dirname + '/views/users.html')});
app.get("/api/users", function (req, res) {
  var Users = [];
  LogUser.forEach(function (userid) {
    var user = {
      username:userid['username'],
      _id:userid['_id']
    };
    Users.push(user)
  });
  
  res.status(200).json(Users);})

app.post('/api/users',(req, res)=>{
  //console.log(req.body.username)
  if(req.body.username != ''){
    var id = crypto.createHash('md5').update(req.body.username).digest('hex');
  
    var userID  = {
      username: req.body.username,
      _id: id,
      count:0,
      log:[]
    }
  
    LogUser.push(userID);
    res.status(200).json({
      username:req.body.username,
      _id:id
    })
  }
  else{
    res.status(200).json({ error: 'invalid username' })
  }
  
})
app.post('/api/users/:_id/exercises',(req, res)=>{

  //console.log(req.params._id+" " + JSON.stringify(req.body));
  var dateex = chekDate(req.body['date'])
for (i = 0; i < LogUser.length; ++i) {
    if(LogUser[i]._id == req.params._id){
      var id = i;
      LogUser[i].count++;
      LogUser[i].log.push({description: req.body['description'],
        duration: chekDuration(req.body['duration']),
        date: dateex})
        break
    }

  }
  res.status(200).json({
        username: LogUser[id].username,
        description: req.body['description'],
        duration: chekDuration(req.body['duration']),
        date: dateex.toDateString(),
        _id: LogUser[id]._id
      })
    
    

    

  });

  function chekDate(strg){

    var d = new Date(strg);
    if (d == "Invalid Date") {
        return new Date()
    }
    else{
      return new Date(strg) 
    }
  }

function chekDuration(Num){
    if(Num > 1){
      return parseInt(Num)

    }
    else{
      return 0
    }
  }






function displayDate(tab){
      if(tab.length > 1){
        for (i = 0; i < tab.length; ++i){
          tab[i].date = new Date(tab[i].date).toDateString()

        }
      }
      else if(tab.length > 0){
        tab[0].date = new Date(tab[0].date).toDateString()

      }
      
      return [...tab]
    }
function GetArrayLog(LogUser,id,start,to){
      const result = LogUser[id].log.filter(log => log.date > start && log.date < to);
      return result

    }



  app.get("/api/users/:_id/logs", function (req, res) {

    // GET user's exercise log: GET /api/users/:_id/logs?[from][&to][&limit]

    //[ ] = optional

    //from, to = dates (yyyy-mm-dd); limit = number
    //logs?from=1987-06-11&to=2021-11-19&limit=5

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    var start = new Date(req.query.from) != "Invalid Date"?new Date(req.query.from):null;
    var to = new Date(req.query.to)!= "Invalid Date"?new Date(req.query.to):null;
    var limit = 0;
    req.query.limit != undefined? limit = parseInt(req.query.limit) :limit = null;

    var logReply = []
    var id = LogUser.findIndex(element => element._id == req.params._id)
    console.log(start,to,limit,id)
    const prom = new Promise((resolve, reject) => {
    function chek(start,to,limit,id){
      if(start != null && to != null && limit != null){
        var arrayTemp = GetArrayLog(LogUser,id,start,to)
        if(arrayTemp.length > limit){
          return [...arrayTemp.slice(0, limit)]
        }
        
      }
      else if(start == null && to == null && limit != null){
        var arrayTemp = [...LogUser[id]["log"]]
        if(limit <= arrayTemp.length){
          return [...arrayTemp.slice(0, limit)]
        }
        else{
            return [...arrayTemp]
        }
        
      }
      else if (start != null && to != null && limit == null){
        return [...GetArrayLog(LogUser,id,start,to)]
      }
      else if (start == null && to == null && limit == null){
        return [...LogUser[id]["log"]]

      }
    }
    logReply = chek(start,to,limit,id);
    resolve();
    
    
    })
prom.then(() => {
  
res.status(200).json({
              username: LogUser[id].username,
              _id: LogUser[id]._id,
              count:LogUser[id].count,
              log:displayDate(logReply)
            })
});

 })





// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
//api short url
app.post('/api/shorturl',(req, res) =>{
  //console.log(req.body.url)
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

  //console.log(req.params.id)
  var URLbyid = shorturlArray[req.params.id];
  res.redirect(URLbyid)
})

//api date + whoami
app.get('/api/date/:date',(req, res) => {
    //console.log(req.params.date)

    if(req.params.date ){
      if(req.params.date.match(/^(\d){1,}$/)){
        var dates = new Date(parseInt(req.params.date))
        //console.log(dates)
        res.json({"unix":parseInt(req.params.date),"utc":dates.toUTCString()})
      }
      else{
        if(new Date(req.params.date) != "Invalid Date" ){

          var dates = new Date(req.params.date)
          //console.log(dates)
          res.json({"unix":dates.getTime(),"utc":dates.toUTCString()})
        }
        else if(req.params.date == 'whoami'){
          res.json({
            ipaddress:	req.header('x-forwarded-for'),
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

app.get('/api/date',(req, res) => { var dates = new Date()
          //console.log(dates+"get/")
          res.json({"unix":dates.getTime(),"utc":dates.toUTCString()})
})







PORT = 3000
// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
