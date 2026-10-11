import { Request, Response } from 'express';

import BaseController from './base.controller';
import Chatroom from '../models/chatroom.model';

class ChatroomsController extends BaseController {
  constructor() {
    super(Chatroom);
  }

  async createRoom(req: Request, res: Response) {
    const { createdBy, participants } = req.body;

    this.logger.debug(
      `group before creating room: ${JSON.stringify(participants)}`
    );

    this.logger.debug(`createdBy: ${JSON.stringify(createdBy)}`);

    try {
      if (!participants || participants.length < 2)
        throw new this.AppError('at least 2 participants required', 400);

      if (participants.length === 2) {
        const canonicalKey = [...participants].sort().join('');
        const existing = await this.model.findOne({ canonicalKey }).lean();
        if (existing) {
          return res.status(200).json({
            message: 'Chatroom already exists',
            data: existing,
          });
        }
      }

      const newChatroom = new this.model({ createdBy, participants });

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
  async addToRoom(req: Request, res: Response) {
    const userId = req.meta?.user?._id;
    const { chatroomId, participantIds } = req.body;

    try {
      if (!chatroomId || !participantIds || participantIds.length === 0) {
        throw new this.AppError(
          'chatroomId and participantIds are required',
          400
        );
      }

      const room = await this.model.findOne({
        _id: chatroomId,
        participants: userId,
      });

      if (!room) {
        throw new this.AppError('chatroom not found or access denied', 404);
      }

      const newIds = participantIds.filter(
        (id: string) =>
          !room.participants.map((p: any) => p.toString()).includes(id)
      );

      if (newIds.length === 0) {
        return res
          .status(200)
          .json({ message: 'All users are already in the room', data: room });
      }

      room.participants.push(...newIds);
      room.canonicalKey = undefined as any;
      const updated = await room.save();

      return res.status(200).json({
        message: 'Participants added successfully',
        data: updated,
      });
    } catch (e) {
      this.logger.error('Error adding to room:', e);
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

const chatroomsController = new ChatroomsController();

export default chatroomsController;
