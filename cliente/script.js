import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io();

// Referencias a los elementos del DOM
const form = document.getElementById('form');
const input = document.getElementById('input'); // ¡Ahora existe en el HTML!
const messages = document.getElementById('messages');
const ipDisplay = document.getElementById('ip-display');
const showQrBtn = document.getElementById('show-qr-btn');
const qrContainer = document.getElementById('qr-container');
const qrImage = document.getElementById('qr-image');
let qrLoaded = false; // Bandera para cargar el QR una sola vez

// --- Funcionalidad del QR ---
async function fetchQrCode() {
    if (qrLoaded) return; 

    try {
        const response = await fetch('/qrcode');
        const data = await response.json();
        
        qrImage.src = data.qrCode;
        qrLoaded = true; 
        
        console.log('QR generado para:', data.url);

    } catch (error) {
        console.error('No se pudo obtener el QR:', error);
        qrImage.alt = 'Error al cargar QR.';
    }
}

showQrBtn.addEventListener('click', () => {
    if (!qrLoaded) {
        fetchQrCode();
    }
    
    qrContainer.style.display = qrContainer.style.display === 'none' ? 'block' : 'none';
    showQrBtn.textContent = qrContainer.style.display === 'none' ? '🖼️ QR' : 'Ocultar';
});

// --- Manejo de Mensajes del Chat ---
socket.on('chat message', (msg) => {
    const item = `<li> ${msg}</li>`;
    messages.insertAdjacentHTML('beforeend', item);
    // Para desplazar automáticamente al último mensaje
    messages.scrollTop = messages.scrollHeight; 
});

// --- Envío de Mensajes del Formulario ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(input.value){
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// --- Actualización de Información del Servidor ---
socket.on('server_info', (data) => {
    if (ipDisplay) {
        ipDisplay.textContent = `${data.ip}:${data.port}`;
    }
});