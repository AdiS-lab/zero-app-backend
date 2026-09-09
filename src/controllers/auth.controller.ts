import argon2 from 'argon2';

import BaseController from './base.controller';
import { Request, Response } from 'express';
import { Auth, User } from '../models';
import { ITokenPayload } from '../utils/jwt.utils';
import generateDefaultAvatar from '../utils/generate-default-avatar';
class AuthController extends BaseController {
  constructor() {
    super(Auth);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        throw new this.AppError('Email or password not provided', 400);

      const user = await User.findOne({ email });
      if (!user) throw new this.AppError('User not found', 404);

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) throw new this.AppError('Password does not match', 401);

      const tokens = await this.jwt.createTokens({
        _id: user._id.toString(),
        email: user.email,
      });

      const tokenExists = await this.model.findOne({ userId: user._id });

      if (!tokenExists) {
        const authToken = new this.model({
          userId: user._id,
          refreshToken: tokens.refreshToken,
        });
        await authToken.save();
      } else {
        await this.model.findOneAndUpdate(
          {
            userId: user._id,
          },
          {
            refreshToken: tokens.refreshToken,
          }
        );
      }

      return res
        .status(200)
        .json({ message: 'Successfully logged in user', ...tokens });
    } catch (e: unknown) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('authController.login = ', e);
      return res.status(500).json({ message: 'Internal servor error' });
    }
  }

  /**
   * @async
   * @param req - req.body -> email, password
   * @param res
   * @returns {Object} -> { accessToken: string, refreshToken: string , message: 'User successfully created' }
   */

  async signup(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new this.AppError('Email or password not provided', 400);
    }
    const user = await User.findOne({ email });
    if (user) throw new this.AppError('User already exists', 400);

    try {
      const userModel = this.registry.get('user.model');

      const avatar = generateDefaultAvatar(email);

      const newUser = new userModel({ email, password, avatar });

      const savedUser = await newUser.save();

      const tokens = await this.jwt.createTokens({
        _id: savedUser._id.toString(),
        email: savedUser.email,
      });

      const { accessToken, refreshToken } = tokens;

      const authToken = new this.model({
        userId: savedUser._id,
        refreshToken: refreshToken,
      });
      await authToken.save();

      this.broker.emit('auth:signup', {
        email: savedUser.email,
        subject: 'Thanks for signing up!',
        text: 'Click the button below to verify your email',
        _id: savedUser._id.toString(),
      });

      return res.status(201).json({
        message: 'User successfully created',
        accessToken,
        refreshToken,
      });
    } catch (e: unknown) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('authController.signup = ', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async logout(req: Request, res: Response) {
    const id = req.id;
    await User.findByIdAndUpdate(id, { refreshToken: null });
    return res.status(200).json({ message: 'Logged out' });
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.meta?.user?._id;
      const userModel = this.registry.get('user.model');
      const user = await userModel.findById(userId);

      if (!user) throw new this.AppError('User not found', 404);

      const pickedUser = this._.pick(user, [
        '_id',
        'email',
        'verified',
        'avatar',
      ]);

      this.logger.debug(JSON.stringify(user));

      return res.status(200).json({ user: pickedUser });
    } catch (e: unknown) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('authController.me: =', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async subscribe(req: Request, res: Response) {
    const userId = req.meta?.user?._id;
    const subscriptionObject = req.body;

    try {
      const result = await this.model.findOneAndUpdate(
        { userId },
        { subscriptionObject }
      );
      if (!result) throw new this.AppError('Unable to find user', 404);
      /**
       * send email in queue
       */
      res.status(200).json({ message: 'Successfully subscribed' });
    } catch (e) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      this.logger.error('authController.subscribe = ', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const { token: accessToken } = req.params as { token: string };

    if (!accessToken)
      throw new this.AppError('No access token found in params', 400);
    try {
      const payload: ITokenPayload =
        await this.jwt.verifyAccessToken(accessToken);

      await User.findOneAndUpdate({ _id: payload._id }, { verified: true });

      res.redirect('http://localhost:5173/chatroom');
    } catch (e: unknown) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePassword(req: Request, res: Response) {
    const passwordInfo = req?.body;

    if (!passwordInfo) throw new this.AppError('password or id missing ', 400);
    const { newPassword, token } = passwordInfo;
    try {
      const payload = await this.jwt.verifyAccessToken(token);

      await User.findOneAndUpdate(
        {
          _id: payload._id,
        },
        {
          password: newPassword,
        }
      );

      this.logger.info('successfully updated user!');
      return res.status(200).json({ message: 'successfully updated password' });
    } catch (e) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const emailInfo = req?.body;

    if (!emailInfo)
      throw new this.AppError('email not included in request', 400);

    const { email } = emailInfo;

    try {
      const user = await User.findOne({ email });
      if (!user)
        throw new this.AppError(
          'no user currently exists with this email',
          400
        );

      const { _id } = user;

      this.broker.emit('auth:password-reset', {
        email,
        subject: 'ZERO => Reset your password',
        text: 'Click the link below to reset your password',
        _id,
      });

      return res.status(200).json({ message: 'emitted reset password event' });
    } catch (e) {
      if (e instanceof this.AppError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

const authController = new AuthController();

export default authController;
