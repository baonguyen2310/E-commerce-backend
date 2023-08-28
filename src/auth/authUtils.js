const { Certificate } = require('crypto')
const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // đăng ký chữ ký jwt bằng privateKey
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // verify bằng publicKey
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('verify error::', err)
            } else {
                console.log('verify success::', decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

module.exports = {
    createTokenPair
}