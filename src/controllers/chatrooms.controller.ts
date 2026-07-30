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
    } catch (error) {
      this.logger.error('Error creating chatroom:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

const chatroomsController = new ChatroomsController();

export default chatroomsController;
