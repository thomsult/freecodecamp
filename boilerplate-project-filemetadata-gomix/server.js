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
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }

})

const upload = multer({ storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      console.log('image Upload');
      //name, type, and size in bytes within the JSON response.
      cb(null, true);
    } else {
      cb(null, false);
      console.log('not Upload');
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }}).single('upfile')

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
app.post('/api/fileanalyse',function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json({ message: err })
    } else if (err) {
      res.json({ message: err })
    }

    console.log(req.file)
    var fileJsoninfo = {
      id: req.file.filename,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      url:'http://localhost:3000/api/uploads/'+req.file.filename

    }
    uploadArray.push(fileJsoninfo);

    res.json(fileJsoninfo)
    })
    
    
    
  })
  app.get('/api/uploads/:img',function (req, res){
    var fl = req.params.img
    res.sendFile(__dirname +'/uploads/'+fl)

  })



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
