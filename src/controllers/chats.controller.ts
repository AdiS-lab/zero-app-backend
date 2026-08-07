import BaseController from './base.controller';
import Chat from '../models/chat.model';

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
}

const chatsController = new ChatsController();

export default chatsController;
