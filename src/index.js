const express = require('express')
const cors = require('cors')
const router = require('./routes/web')
const Connection = require('./database/Connection')
require('dotenv').config();
const app = express()
const port = 3001

app.use(express.json());
app.use(cors({
  credentials:true,
    origin: [
    'http://localhost:3000', // for local development
  ]
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(router);

new Connection()

app.get('/',(req,res)=>{
    res.send('welcome to my portfolio backend')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app
