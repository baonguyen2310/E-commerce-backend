const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString() //do nó là buffer nên phải chuyển thành string để lưu vào db
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })
            return token ? token.publicKey : null
        } catch (error) {
            return error
        }
    }


}

module.exports = KeyTokenService