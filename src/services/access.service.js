const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keytoken.service') // lưu publicKey vào db
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, ConflictRequestError } = require('../core/error.response')
const { OK, CREATED } = require('../core/success.response')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    
    static signUp = async ({ name, email, password }) => {
        // try {
            // step1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new ConflictRequestError({
                    message: 'Shop already existed'
                })
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            // đăng ký xong là đăng nhập luôn
            if (!newShop) {
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

                // lưu publicKey vào db
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    throw new BadRequestError({
                        message: 'publicKeyString error'
                    })
                }

                // lấy ra để tạo tokens cho client và verify: chuyển publicKeyString thành object
                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // tạo và verify token
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKeyObject,
                    privateKey
                )
                //console.log('create tokens success::', tokens)

                // trả về tokens cho controller
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

}

module.exports = AccessService