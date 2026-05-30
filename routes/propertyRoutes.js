const express = require('express')
const router = express.Router()

const {
    addProperty,
    getProperties,
    getPropertyById,
    getBuyProperties
} = require('../controllers/propertyController')

// ১. পোস্ট রাউট
router.post('/add', addProperty)

// ২. সাধারণ গেট রাউট (সব প্রপার্টি)
router.get('/', getProperties)

router.get('/buy', getBuyProperties) // <--- এখানে নিয়ে আসুন


router.get('/:id', getPropertyById)

module.exports = router