const express = require('express')
const router = express.Router()


const { TaskPath } = require('../controller/Tasks/Paths')
const { InsertTask, DeleteTask } = require('../controller/Tasks/CRUDoperations')

router.get('/', TaskPath)

router.post('/create', InsertTask)

router.post('/delete/:id', DeleteTask)



module.exports = router