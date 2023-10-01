const AccessService = require('../services/access.service')

class AccessController {
    signUp = async (req, res, next) => {
        try {
            const response = await AccessService.signUp(req.body)
            return response.send(res) //gửi tokens cho client
        } catch (error) {
            next(error) //truyền error xuống middleware handle error toàn cục
        }
    }
}

module.exports = new AccessController()