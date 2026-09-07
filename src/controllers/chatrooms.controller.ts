import { Request, Response } from 'express';

import BaseController from './base.controller';
import Chatroom from '../models/chatroom.model';

class ChatroomsController extends BaseController {
  constructor() {
    super(Chatroom);
  }

  async createRoom(req: Request, res: Response) {
    try {
      const { chatter, chattee } = req.body;
      const newChatroom = new this.model({ chatter, chattee });
      const savedChatroom = await newChatroom.save();
      this.broker.emit('chatroom:created', savedChatroom.toObject());

      return res.status(201).json({
        message: 'Chatroom created successfully',
        data: savedChatroom,
      });
    } catch (e) {
      this.logger.error('Error creating chatroom:', e);
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('chatroomController.createRoom =  ', e);
      return res.status(500).json({ message: 'Internal servor error' });
    }
  }

  async me(req: Request, res: Response) {
    const userId = req.meta?.user?._id;

    this.logger.debug('controllers: chatrooms: my-rooms: successfully hit');

    try {
      const rooms = await this.model
        .find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .lean();

      return res
        .status(200)
        .json({ message: 'all your rooms are retrieved!', rooms });
    } catch (e) {
      this.logger.error('Error creating chatroom:', e);
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('authController.login = ', e);
      return res.status(500).json({ message: 'Internal servor error' });
    }
  }
}

const chatroomsController = new ChatroomsController();

export default chatroomsController;
