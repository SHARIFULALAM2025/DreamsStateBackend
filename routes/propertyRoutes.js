const express =
    require('express')

const router =
    express.Router()

const {
    addProperty,
    getProperties,
    getPropertyById,
    getBuyProperties
} = require(
    '../controllers/propertyController'
)

router.post(
    '/add',
    addProperty
)

router.get(
    '/',
    getProperties
)
router.get('/:id', getPropertyById)
router.get('/buy', getBuyProperties)

module.exports =
    router