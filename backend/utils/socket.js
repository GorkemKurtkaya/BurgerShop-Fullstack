import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('Yeni bir kullanıcı bağlandı:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('Kullanıcı ayrıldı:', socket.id);
        });

        // Test mesajı gönder
        socket.emit('test', { message: 'Test mesajı' });
    });
};

export const getIO = () => {
    if (!io) {
        console.error('Socket.io başlatılmadı!');
        throw new Error('Socket.io başlatılmadı');
    }
    return io;
};