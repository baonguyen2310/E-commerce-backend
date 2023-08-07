const mongoose = require('mongoose')

const connectionString = 'mongodb://localhost:27017'

if (1 === 1){
    mongoose.set("debug", true)
    mongoose.set("debug", {color: true})
}

mongoose.connect(connectionString)
    .then(() => console.log('Connected mongodb'))
    .catch(err => console.log('Error connect'))