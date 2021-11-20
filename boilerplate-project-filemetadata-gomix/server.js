var express = require('express');
var cors = require('cors');
const  multer  = require('multer');
require('dotenv').config()

var app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname +'/uploads'));
var uploadArray = [];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname +'/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }

})

const upload = multer({ storage: storage}).single('upfile')
  

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
app.post('/api/fileanalyse',function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
       res.status(500).json({ message: err})
    } else if (err) {
       res.status(500).json({ message: err,message2: 'file no allowed'})
    }
    else if(req.file){
    console.log(req.file)
    var fileJsoninfo = {
      id: req.file.filename,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      url:'https://freecodecamp.thomsult.repl.co/api/uploads/'+req.file.filename}
    uploadArray.push(fileJsoninfo);
      res.status(200).json(fileJsoninfo)
    }
    else{
      res.status(200).json({ message: 'file no allowed'})

    }
    
    
    
})
   

    
    
    
  })
  app.get('/api/uploads/:img',function (req, res){
    var fl = req.params.img
     res.status(200).sendFile(__dirname +'/uploads/'+fl)

  })



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
