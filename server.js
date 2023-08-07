const app = require('./src/app')

const PORT = 3305

const server = app.listen(PORT, () => {
    console.log(`e-commerce start with ${PORT}`)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`))
//     //notify.send(ping ....)
// })