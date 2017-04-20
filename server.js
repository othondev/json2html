var express    = require('express')
var bodyParser = require('body-parser')
var app = express()
var json2html = require('./json2html.js')

app.use(bodyParser.json())
app.use(express.static('./'))

app.get('/', (req,res) => {
  res.render(__dirname+'/index.html');
  //res.send(json2html.reciverJsonAndRetunHTML(req.body.layout));
});

app.listen(3000, () =>{
  console.log('3000... ');
});
