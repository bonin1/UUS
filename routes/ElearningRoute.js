const express = require('express')
const router = express.Router()


const { ElearningPath, GetTasks, GetCalendar } = require('../controller/Elearning/Paths')

const AuthMiddleware = require('../middleware/AuthMiddleware')


router.get('/', AuthMiddleware, ElearningPath)

router.get('/tasks', AuthMiddleware, GetTasks)

router.get('/calendar', AuthMiddleware, GetCalendar)




module.exports = router