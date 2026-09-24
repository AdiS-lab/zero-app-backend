import { Request, Response } from 'express';

import BaseController from './base.controller';
import Chatroom from '../models/chatroom.model';

class ChatroomsController extends BaseController {
  constructor() {
    super(Chatroom);
  }

  async createRoom(req: Request, res: Response) {
    const { chatter, chatees } = req.body;

    this.logger.debug(`group before creating room: ${JSON.stringify(chatees)}`);

    this.logger.debug(
      `chatee before creating room: ${JSON.stringify(chatees[0])}`
    );

    try {
      if (chatees.length == 0)
        throw new this.AppError('no people provided', 400);

      const newChatroom =
        chatees.length === 2
          ? new this.model({ chatter, chattee: chatees[0] })
          : new this.model({ chatter, participants: chatees });

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
      return res.status(500).json({ message: 'Internal servor error' });
    }
  }

  async me(req: Request, res: Response) {
    const userId = req.meta?.user?._id;

    this.logger.debug('========== RETRIEVING ROOMS =======');

    try {
      const rooms = await this.model
        .find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .lean();

      return res
        .status(200)
        .json({ message: 'all your rooms are retrieved!', rooms });
    } catch (e) {
      this.logger.error('Error finding user in chatroom:', e);
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      return res.status(500).json({ message: 'Internal servor error' });
    }
  }

  async hasAccess(userId: string, chatroomId: string): Promise<boolean> {
    try {
      this.logger.debug('========= CHECKING ACCESS ==============');

      const room = await this.model
        .findOne({
          _id: chatroomId,
          participants: userId,
        })
        .lean();

      return !!room;
    } catch (e) {
      this.logger.error('Error checking chatroom access:', e);
      return false;
    }
  }
}

const chatroomsController = new ChatroomsController();

export default chatroomsController;
