'use strict'

const { findById } = require('../services/apikey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

// Middleware checkApiKey
const checkApiKey = async (req, res, next) => {
    try {
        // check header có apikey không
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check apikey của header có trong db không
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}

// Middleware checkPermission
// Giải thích việc trả về closer khi truyền 1 custom param vào middleware: 
// do router.use chỉ nhận 1 hàm middleware(req, res, next)
// việc truyền tham số checkPermission(permission) sẽ gọi luôn và return giá trị
// nên giá trị return phải là 1 hàm middleware(req, res, next)
// đây là 1 hàm closer vì nó truy cập vào biến permission của hàm cha trong khi hàm cha đã được thực thi

const checkPermission = ( permission ) => {
    return (req, res, next) => {
        if (!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        return next()
    }
}

module.exports = {
    checkApiKey,
    checkPermission
}