import express from 'express'
import salesRoute from './sales.js'


const router = express.Router()

router.use('/sales', salesRoute )

export default router;