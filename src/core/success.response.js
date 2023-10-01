const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = message ? message : reasonStatusCode
        this.status = statusCode
        this.metadata = metadata
    }

    send(res){
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}}) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

module.exports = {
    OK,
    CREATED
}