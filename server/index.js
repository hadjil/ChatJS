import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 8882

const app = express()
app.use(logger('dev'))

const server = createServer(app)
const io = new Server(server)


io.on('connection',()=>{
  console.log('Usuario conectado :)')
})


app.get('/', (req, res) => {
  res.sendFile(process.cwd()+'/cliente/index.html')

})

server.listen(port, () => {
  console.log(`Servidor corriendo por el puerto: localhost : ${port}`)
})

export default app;