import express from 'express'
import logger from 'morgan'
import os from 'node:os';

import qrcode from 'qrcode';
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 8882

const app = express()


const server = createServer(app)
const io = new Server(server,{
  connectionStateRecovery:{}
})

//Metodo Para conseguir la Ip real
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name in interfaces) {
        for (const net of interfaces[name]) {
            // Filtramos por IPv4 y excluimos la dirección interna (127.0.0.1)
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                return localIp;
            }
        }
    }
    return localIp;
}

// 2. Iniciar el servidor
const ipAddress = getLocalIp();





//Desconectar debe ir dentro
io.on('connection',(socket)=>{
  console.log('Usuario Conectado :)')
  


  socket.on('disconnect',(socket)=>{
  console.log('Usuario Desconectado :/')
})

socket.on('chat message', (msg) => {
  console.log('Mensajito recibido: ', msg);
 } )

 socket.on('chat message', (msg) => {
  io.emit('chat message', msg);
 })

 socket.emit('server_info', { ip: ipAddress, port: port });




})


app.use(logger('dev'))

// Servir archivos estáticos desde la carpeta 'cliente'
app.use(express.static('cliente'));



app.get('/', (req, res) => {
  res.sendFile(process.cwd()+'/cliente/index.html')

})

//Generara QR apartir de la ip
app.get('/qrcode', async (req, res) => {
    const urlToEncode = `http://${ipAddress}:${port}`;
    try {
        const qrCodeDataUrl = await qrcode.toDataURL(urlToEncode);
        res.json({ qrCode: qrCodeDataUrl, url: urlToEncode });
    } catch (err) {
        console.error('Error generando el código QR:', err);
        res.status(500).send('Error interno del servidor al generar QR.'); }
});

server.listen(port, () => {
  console.log(`Servidor corriendo por el puerto: localhost : ${port}`)

 
    console.log(`🌐 Servidor Socket.IO corriendo en:`);
    console.log(`    - Red local (LAN): http://${ipAddress}:${port}`);
    console.log(`    - Loopback (Local): http://localhost:${port}`);
    console.log(`\nEsperando conexiones de clientes...`);

  
})








export default app;