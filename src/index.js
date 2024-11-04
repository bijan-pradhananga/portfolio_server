const express = require('express')
require('dotenv').config();
const cors = require('cors')
const router = require('./routes/web')
const Connection = require('./database/Connection')

const app = express()
const port = 3001

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [
    'https://portfolio-client-gamma-plum.vercel.app',
    'https://portfolio-project-form.vercel.app/',
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
