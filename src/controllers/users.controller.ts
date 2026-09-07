import BaseController from './base.controller';
import { User } from '../models';
import { Request, Response } from 'express';

class UsersController extends BaseController {
  constructor() {
    super(User);
  }

  async getUserByEmail(req: Request, res: Response) {
    const payload = req?.body;
    try {
      if (!payload) throw new this.AppError('no email provided', 400);
      const user = await this.model.findOne({
        email: payload.email,
      });
      return res.status(200).json({ message: 'successful retrieval', user });
    } catch (e: unknown) {
      this.logger.error('Error:', e);
      return res.status(500).json({ message: 'successful retrieval' });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    const userId = req?.meta?.user?._id;
    const file = req.file;
    try {
      if (!userId || !file)
        throw new this.AppError('no file or userId provided', 400);

      const { buffer, mimetype } = file;

      this.logger.debug(`this is file mimetype: ${JSON.stringify(mimetype)}`);
      this.logger.debug(`this is userId: ${JSON.stringify(userId)}`);

      const user = await this.model.findOneAndUpdate(
        { _id: userId }, // make sure _id is being searched
        {
          $set: {
            avatar: { buffer, mimetype },
          },
        },
        { new: true }
      );

      if (!user)
        throw new this.AppError(
          'could not find and update avatar for user',
          404
        );

      return res.status(200).json({ message: 'successful retrieval', user });
    } catch (e: unknown) {
      this.logger.error('Error:', e);
      return res.status(500).json({ message: 'successful retrieval' });
    }
  }
}

const usersController = new UsersController();

export default usersController;
