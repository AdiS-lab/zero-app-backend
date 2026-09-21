import logger from '../logs/logger';
import type { Server } from 'socket.io';

export default function initializeSocket(io: Server) {
  io.on('connection', (socket) => {
    logger.info('connected', socket.id);

    socket.on('chat-message', (data) => {
      logger.info('message sent was', data);
      io.to(data.chatroomId).emit('message-sent', data);
    });

    socket.on('join-room', (data) => {
      io.emit('joined-room', data);
    });

    socket.on('leave-room', (data) => {
      io.emit('left-room', data);
    });

    socket.on('disconnect', (data) => {
      logger.info('User left room: ', data);
    });
  });
}
