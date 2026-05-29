const express =
    require('express')

const router =
    express.Router()

const {
    addProperty,
    getProperties,
    getPropertyById
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

module.exports =
    router