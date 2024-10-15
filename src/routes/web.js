const express = require('express')
const projectRouter = require('./projectRoute')
const router = express.Router()

router.use('/project',projectRouter)

module.exports = router