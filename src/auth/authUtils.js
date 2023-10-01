const JWT = require('jsonwebtoken')
const { BadRequestError, ConflictRequestError } = require('../core/error.response')
const { findByUserId } = require('../services/keytoken.service')

const HEADER = {
    API_KEY: 'x-api-key', // apiKey
    CLIENT_ID: 'x-client-id', //userId
    AUTHORIZATION: 'authorization' //accessToken
    //refreshToken truyền bằng body
}

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

const authentication = async (req, res, next) => {
    try {
        // 1. check userId existed
        const userId = req.headers[HEADER.CLIENT_ID]
        if (!userId) throw new BadRequestError({ message: 'headers not have CLIENT_ID' })
        
        // 2. get accessToken from req
        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) throw new BadRequestError({ message: 'headers not have AUTHORIZATION' })

        // 3. get token from db
        const keyStore = await findByUserId(userId)
        if (!keyStore) throw new BadRequestError({ message: 'not found keyToken' })

        // 4. verify token
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        // 5. check userId
        if (userId !== decodeUser.userId) throw new ConflictRequestError({ message: 'not match userId' })

        // 6. return next()
        req.keyStore = keyStore
        return next()
        
    } catch (error) {
        next(error)
    }
    
}

module.exports = {
    createTokenPair,
    authentication
}