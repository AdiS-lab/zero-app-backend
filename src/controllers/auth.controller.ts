import argon2 from 'argon2';

import BaseController from './base.controller';
// import { createTokens, validateRefreshToken } from '../utils/jwt.utils';
import { Request, Response } from 'express';
import { Auth, User } from '../models';
class AuthController extends BaseController {
  constructor() {
    super(Auth);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email or password not provided' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(401).json('Password does not match');

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
      throw new Error('Email or password not provided');
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    try {
      // const hashedPassword = await this.hashStrategy.hash(password);
      const userModel = this.registry.get('user.model');

      const newUser = new userModel({ email, password });

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

      // send email to verify email address

      return res.status(201).json({
        message: 'User successfully created',
        accessToken,
        refreshToken,
      });

      // const createdUser = await User.create({
      //   email,
      //   password: hashedPassword,
      // });
      // return res
      //   .status(201)
      //   .json({ createdUser, message: 'User successfully created' });
    } catch (error: any) {
      if (error.message === 'Email or password not provided') {
        res.status(400).json({
          e: error.message,
          message: 'Email or password not provided',
        });
      }

      return res
        .status(500)
        .json({ e: error.message, message: 'Unsuccessful creation' });
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

      if (!user) throw new Error('User not found');

      const pickedUser = this._.pick(user, ['_id', 'email', 'verified']);

      return res.status(200).json({ user: pickedUser });
    } catch (error: unknown) {
      this.logger.error('authController.me: =', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // async refresh(req: Request, res: Response) {
  //   try {
  //     const originalToken = req.body?.refresh_token;
  //     const { id, email } = (await validateRefreshToken(originalToken)) as {
  //       id: string;
  //       email: string;
  //     };

  //     const { refreshToken, accessToken } = await createTokens(id, email);
  //     await Auth.findByIdAndUpdate(id, { refreshToken });
  //     return { refreshToken, accessToken };
  //   } catch (error: any) {
  //     return res
  //       .status(400)
  //       .json({ e: error.message, message: 'Rehydration has a problem' });
  //   }
  // }
  // async forgotPassword(req: Request, res: Response) {
  //   const { email, password } = req.body;
  //   const user = await User.findOne({ email });
  //   if (!user) return res.status(404).json({ message: 'User not found' });

  //   const hashedPassword = await argon2.hash(password);
  //   await User.findByIdAndUpdate(user.id, { password: hashedPassword });
  //   return res.status(200).json({ message: 'Updated password' });
  // }

  // async verifyEmail(req: Request, res: Response) {
  //   const email = req.body;
  //   const user = await User.findOne({ email });
  //   if (!user) return res.status(404).json({ message: 'User not found' });
  //   return res.status(200).json({ message: user });
  // }
}

const authController = new AuthController();

export default authController;
