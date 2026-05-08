const express = require('express')
require('dotenv').config();
const cors = require('cors')
const router = require('./routes/web')
const Connection = require('./database/Connection')
const { setServers } = require("node:dns/promises");

setServers(["1.1.1.1", "8.8.8.8"]);

const app = express()
const port = 3001

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}))



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
