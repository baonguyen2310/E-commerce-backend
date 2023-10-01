const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keytoken.service') // lưu publicKey vào db
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, ConflictRequestError } = require('../core/error.response')
const { OK, CREATED } = require('../core/success.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    
    static signUp = async ({ name, email, password }) => {
        // try {
            // 1. check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new ConflictRequestError({
                    message: 'Shop already existed'
                })
            }
            // 2. hash password
            const passwordHash = await bcrypt.hash(password, 10)

            // 3. create newShop in db
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            // 4. login after register
            // đăng ký xong là đăng nhập luôn
            if (newShop) {
                // create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                // tạo và verify token
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKey,
                    privateKey
                )

                // 5. save publicKey, refreshToken in db
                await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    refreshToken: tokens.refreshToken
                })

                // Chuyển publicKeyString thành publicKeyObject
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // 6. return tokens
                return new CREATED({
                    message: 'Shop created',
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                })

            }

            // api thành công nhưng tạo không thành công
            return new OK({
                message: 'OK'
            })

        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }

    static login = async ({ email, password, refreshToken = null }) => {
        /*
            1. check email in db
            2. match password
            3. create accessToken and refreshToken and save in db
            4. generate tokens
            5. get data return login
        */

        // 1. check email in db
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError({ message: 'Shop not registerd' })

        // 2. match password
        const match = bcrypt.compareSync(password, foundShop.password)
        if (!match) throw new BadRequestError({ message: 'Authentication error' })

        // 3. create accessToken and refreshToken and save in db
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })
        
        // 4. generate and verify tokens
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        )

        // 5. save publicKey, refreshToken in db
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            refreshToken: tokens.refreshToken
        })

        // 6. get data return login
        return new OK({
            message: 'Logined',
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        })
    }

}

module.exports = AccessService