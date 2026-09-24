import { chatroomsController } from '../controllers';
import logger from '../logs/logger';
import type { Server } from 'socket.io';
import jwtUtils from './jwt.utils';

export default function initializeSocket(io: Server) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = await jwtUtils.verifyAccessToken(token);
      socket.userId = decoded._id;

      next();
    } catch (e) {
      logger.debug('error at socket authorization: ', e);
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    logger.info('connected', socket.id);

    socket.on('chat-message', (data) => {
      logger.info(`message sent was ${JSON.stringify(data)}`);
      logger.debug(`chatroom id is ${data.chatroomId}`);
      io.to(data.chatroomId).emit('message-sent', {
        userId: data.userId,
        text: data.text,
        avatar: data.avatar,
      });
    });

    socket.on('join-room', async (data) => {
      logger.debug('======== JOINING ROOM ========');
      const hasAccess = await chatroomsController.hasAccess(
        socket.userId,
        data.chatroomId
      );

      logger.debug(
        `utils, socket handler: usrId is ${socket.userId} ${typeof socket.userId}`
      );
      logger.debug(
        `utils, socket handler: chatroomId is ${data.chatroomId} ${typeof data.chatroomId}`
      );
      logger.debug(`utils, socket handler: hasAccess is ${hasAccess}`);

      if (hasAccess) {
        socket.join(data.chatroomId);
        logger.debug(`${data.userId} joined chatroom ${data.chatroomId}`);
        io.emit('joined-room', data);
      }
    });

    socket.on('leave-room', (data) => {
      io.emit('left-room', data);
    });

    socket.on('disconnect', (data) => {
      logger.info('User left room: ', data);
    });
  });
}
