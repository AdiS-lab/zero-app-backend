import BaseController from './base.controller';

import {createTokens, validateRefreshToken} from '../utils/jwt.utils'
import {Request, Response} from 'express'
import argon2 from 'argon2'
import { Auth, User} from '../models';
class AuthController extends BaseController {
  constructor() {
    super(Auth);
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body
    if (!email || !password) return res.status(400).json({message: "Email or password not provided"}) 

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const isMatch = await argon2.verify(user.password, password)
    if (!isMatch) return res.status(404).json("Password does not match")
    return res.status(200).json({message: "Successfully logged in user"})
  }
  async signup(req: Request, res: Response) {
    const {email, password} = req.body
    if (!email || !password) return res.status(400).json({message: "Email or password not provided"}) 
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    try{
      const hashedPassword = await argon2.hash(password)
      await User.create({
        email,
        password: hashedPassword,
      });
      return res.status(200).json({message: "User successfully created"})
    }
    catch(error: any){
      return res.status(500).json({e: error.message, message: "Unsuccessful creation"})
    }  
  }

  async logout(req: Request, res: Response) {
    const id = req.id
    await User.findByIdAndUpdate(id, { refreshToken: null });
    return res.status(200).json({message: "Logged out"});
  }

  async refresh(req: Request, res: Response) {
    try{
      const originalToken = req.body?.refresh_token
      const {id, email} = await validateRefreshToken(originalToken) as {id: string, email: string}

      const {refreshToken, accessToken} = await createTokens(id, email)
      await Auth.findByIdAndUpdate(id, { refreshToken });
      return {refreshToken, accessToken}
    }catch(error: any){
        return res.status(400).json({e: error.message, message: "Rehydration has a problem"})
    }
  }
  async forgotPassword(req: Request, res: Response) {
    const {email, password} = req.body
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({message: "User not found"})

    const hashedPassword = await argon2.hash(password);
    await User.findByIdAndUpdate(user.id, { password: hashedPassword });
    return res.status(200).json({message: "Updated password"})
  }

  async verifyEmail(req: Request, res: Response) {
    const email = req.body
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({message: "User not found"})
    return res.status(200).json({message: user})
  }
}

const authController = new AuthController();

export default authController;
