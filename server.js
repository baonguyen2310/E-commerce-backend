const app = require('./src/app')
const { app: { port } } = require('./src/configs/config.mongodb')

const server = app.listen(port, () => {
    console.log(`e-commerce start with ${port}`)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`))
//     //notify.send(ping ....)
// })