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
}

const usersController = new UsersController();

export default usersController;
