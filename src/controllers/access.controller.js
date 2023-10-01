const AccessService = require('../services/access.service')

class AccessController {
    signUp = async (req, res, next) => {
        try {
            const response = await AccessService.signUp(req.body)
            return response.send(res) //gửi tokens cho client
        } catch (error) {
            next(error) //truyền error xuống middleware handle error toàn cục
            // nó không truyền xuống middleware 404 vì middleware 404 không có tham số error
        }
    }

    login = async (req, res, next) => {
        try {
            const response = await AccessService.login(req.body)
            return response.send(res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()