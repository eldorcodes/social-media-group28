const express = require('express');
const cors = require('cors');
const app = express();
const port = 5555;
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Message = require('./models/Messages');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// route - GET - POST
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// connec to mongoDB
mongoose.connect(keys.MONGODB_URI)
.then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err));

let pwd = 'hello23'

console.log(pwd)

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(pwd, salt);

console.log(hash);

if (bcrypt.compareSync('hello23', hash)) {
    console.log('Success')
}else{
    console.log('Password does not match')
}

function encryptPassword(password){
    let p = password;
    let randomNum = Math.random();
    let chars = 'wefiwghdfiue2wbfjkwdbfwejkhbfwehjf';

    let h = '';

    for(let i = 0; i < p.length;i++){
        h += chars.charAt(i+2) + randomNum.toString().charAt(i+1)
    }
    return h
}


let newHash = encryptPassword('hello23');

console.log(newHash);


// new Message({
//     sender:'Alex',
//     message:'Hello World',
//     date:new Date().toString(),
//     id:1
// })
// .save()
// .then(() => console.log('New Message created.'))
// .catch((err) => console.log(err))

let data = ['apple','kiwi','banana']

app.post('/data',(req,res) => {
    res.send(data)
})

app.post('/message',(req,res) => {
    console.log(req.body)
    new Message({
        sender:'John',
        message:req.body.message,
        date:new Date().toString()
    })
    .save()
    .then(() => console.log('Message saved'))
    .catch(err => console.log(err))
})

app.get('/messages',(req,res) => {
    Message.find({})
    .then((messages) => {
        res.send(messages)
    })
    .catch((err) => console.log(err))
})

app.post('/remove',(req,res) => {
    console.log(req.body)
    console.log('_id',req.body?._id)
    Message.findByIdAndDelete(req.body._id)
    .then(() => console.log('Message deleted..'))
    .catch(err => console.log(err))
})

app.listen(port,(err) => {
    if (err) {
        throw err
    }else{
        console.log(`Server started at http://localhost:${port}`)
    }
});