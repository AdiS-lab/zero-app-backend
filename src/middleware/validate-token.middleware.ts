import jwtUtils from '../utils/jwt.utils';
import type { Request, Response } from 'express';
import AppError from '../utils/error-handler';
import logger from '../logs/logger';

const validateTokenMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    if (!accessToken) throw new AppError('No access token provided', 401);
    const decoded = await jwtUtils.verifyAccessToken(accessToken);
    req.meta = {
      user: decoded,
    };

    next();
  } catch (e: any) {
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ message: e.message });
    }
    logger.error(e);
    return res.status(401).json({ message: 'Invalid access token' });
  }
};

export default validateTokenMiddleware;
