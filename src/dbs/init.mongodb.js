const mongoose = require('mongoose')

const connectionString = 'mongodb://localhost:27017'

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