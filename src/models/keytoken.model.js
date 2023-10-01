const { Schema, model, Types, default: mongoose } = require('mongoose')

const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'

const keyTokenShema = new Schema({
    user: {
        type: Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenShema)