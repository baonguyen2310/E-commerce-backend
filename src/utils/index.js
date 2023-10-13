const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const convertToObjectIdMongoDB = param => new Types.ObjectId(param)

const removeUndefinedNullNestedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null || obj[k] == undefined) {
            delete obj[k]
        } else if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
            removeUndefinedNullNestedObject(obj[k])
        }
    })
}

const updateNestedObjectParser = obj => {
    const final = {}

    Object.keys(obj).forEach(k => {
        if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => { // đệ quy đến cuối
                final[`${k}.${a}`] = response[a] // nested object --> k1.k2...a = value
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    convertToObjectIdMongoDB,
    removeUndefinedNullNestedObject,
    updateNestedObjectParser
}