import BaseController from './base.controller';
import Chat from '../models/chat.model';
import { Request, Response } from 'express';
class ChatsController extends BaseController {
  constructor() {
    super(Chat);
  }

  listeners() {
    this.broker.on('chatroom:created', async (chatroomData) => {
      this.logger.info('Chatroom created event received:', chatroomData);
      const newChatroomMessages = new this.model({
        chatroomId: chatroomData._id,
      });

      await newChatroomMessages.save();
    });
  }

  async addMessage(req: Request, res: Response) {
    const msgPayload = req.body as { chatroomId: string; message: string };

    this.logger.debug(
      `chats controllers msg payload: ${JSON.stringify(msgPayload)}`
    );
    const userId = req?.meta?.user?._id;

    const { chatroomId, message } = msgPayload;

    try {
      if (!chatroomId || !message || !userId)
        throw new this.AppError('no id or message provided', 400);

      await this.model.findOneAndUpdate(
        { chatroomId },
        {
          $push: {
            messages: {
              chatter: userId,
              content: message,
              media: {
                mediaUrls: [],
                mediaType: 'text',
              },
              timestamp: new Date(),
            },
          },
        }
      );

      return res
        .status(200)
        .json({ message: 'sucessfully added message to schema' });
    } catch (e) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('chatController.addMessage = ', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMessagesById(req: Request, res: Response) {
    const chatroomId = req.params;
    try {
      if (!chatroomId) throw new this.AppError('no chatroom id provided', 400);
      const messageList = await this.model.findOne(chatroomId);
      return res
        .status(200)
        .json({ message: 'successfully retrieved messages', messageList });
    } catch (e) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('chatController.addMessage = ', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

const chatsController = new ChatsController();

export default chatsController;
