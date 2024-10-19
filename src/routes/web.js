const express = require('express')
const projectRouter = require('./projectRoute')
const categoryRouter = require('./categoryRoute')
const router = express.Router()

router.use('/project',projectRouter)
router.use('/category',categoryRouter)

module.exports = router