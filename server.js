const express = require('express');
const cors = require('cors');
const app = express();
const port = 5555;
// route - GET - POST
let data = ['Apple','Kiwi','Cherry']

app.use(cors());

app.post('/data',(req,res) => {
    res.send(data)
})


app.listen(port,(err) => {
    if (err) {
        throw err
    }else{
        console.log(`Server started at http://localhost:${port}`)
    }
});