const express = require('express')

const router = express.Router()

router.use('/v1/api', require('./access'))

// router.get('/', (req, res, next) => {
//     const compressionStr = 'Hello Nodejs'
//     return res.status(200).json({
//         message: 'Wellcome To Router',
//         //metadata: compressionStr.repeat(100000)
//     })
// })

module.exports = router