const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            const publicKeyString = publicKey.toString() //do nó là buffer nên phải chuyển thành string để lưu vào db
            // const token = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString
            // })

            const filter = { user: userId }
            const update = { publicKey: publicKeyString, refreshTokensUsed: [], refreshToken }
            const options = { upsert: true, new: true } // upsert là tạo mới nếu không tìm thấy

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }


}

module.exports = KeyTokenService