import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/config';

interface ITokenPayload {
  _id: string;
  email: string;
}

class JwtUtils {
  async createAccessToken(payload: ITokenPayload) {
    const accessToken = jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: (config.accessTokenTtl as SignOptions['expiresIn']) || '15m',
    });
    return accessToken;
  }

  async createRefreshToken(payload: ITokenPayload) {
    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
      expiresIn: (config.refreshTokenTtl as SignOptions['expiresIn']) || '2d',
    });
    return refreshToken;
  }

  async createTokens(payload: ITokenPayload) {
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(accessToken: string) {
    const decoded = jwt.verify(accessToken, config.accessTokenSecret);
    return decoded as ITokenPayload;
  }

  async verifyRefreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
    return decoded as ITokenPayload;
  }
}

const jwtUtils = new JwtUtils();

export default jwtUtils;

// async function createAccessToken(payload: ITokenPayload) {
//   const accessToken = jwt.sign(payload, config.accessTokenSecret, {
//     expiresIn: '15m',
//   });
//   return accessToken;
// }

// async function createRefreshToken(payload: ITokenPayload) {
//   const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
//     expiresIn: '2d',
//   });
//   return refreshToken;
// }

// async function createTokens(_id: string, email: string) {
//   const accessToken = await createAccessToken({ _id, email });
//   const refreshToken = await createRefreshToken({ _id, email });
//   return { accessToken, refreshToken };

//   // const accessToken = jwt.sign({ id, email }, config.accessTokenSecret, {
//   //   expiresIn: '15m',
//   // });
//   // const refreshToken = jwt.sign({ id, email }, config.refreshTokenSecret, {
//   //   expiresIn: '2d',
//   // });
// }

// async function validateAccessToken(accessToken: string) {
//   const payload = jwt.verify(accessToken, config.accessTokenSecret);
//   if (!payload) {
//     throw new Error();
//   }
//   return payload;
// }

// async function validateRefreshToken(refreshToken: string) {
//   const payload = jwt.verify(refreshToken, config.refreshTokenSecret);
//   if (!payload) {
//     throw new Error();
//   }
//   return payload;
// }

// export { createTokens, validateAccessToken, validateRefreshToken };
