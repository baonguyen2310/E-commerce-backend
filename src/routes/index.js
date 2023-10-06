const express = require('express')
const router = express.Router()

const { checkApiKey, checkPermission } = require('../auth/checkAuth')

// Middlewares
// check apiKey (trong header khi client gọi api)
router.use(checkApiKey)

// check permission
router.use(checkPermission('0000'))

// access phải nằm dưới product để authen trong access không chặn router for normal user trong product
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))

// router.get('/', (req, res, next) => {
//     const compressionStr = 'Hello Nodejs'
//     return res.status(200).json({
//         message: 'Wellcome To Router',
//         //metadata: compressionStr.repeat(100000)
//     })
// })

module.exports = router