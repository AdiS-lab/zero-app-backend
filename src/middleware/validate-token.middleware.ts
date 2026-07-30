import jwtUtils from '../utils/jwt.utils';
import type { Request, Response } from 'express';
// import logger from '../logs/logger';

const validateTokenMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken)
    return res.status(400).json({ message: 'No access token provided' });
  try {
    const decoded = await jwtUtils.verifyAccessToken(accessToken);
    req.meta = {
      user: decoded,
    };
    // req.id = decoded._id;
    // const { id } = (await jwtUtils.verifyAccessToken(accessToken)) as {
    //   id: string;
    // };
    // req.id = id;
    next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ e: error.message, message: 'Invalid access token' });
  }
};

export default validateTokenMiddleware;
