const mongoose = require('mongoose')
const { db: {host, port, name} } = require('../configs/config.mongodb')

const connectionString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb'){
        mongoose.connect(connectionString, {
            maxPoolSize: 50
        })
            .then(() => console.log(`Connected mongodb success`))
            .catch(err => console.log(`Error connect`))
    }

    static getInstance() {
        if (!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb