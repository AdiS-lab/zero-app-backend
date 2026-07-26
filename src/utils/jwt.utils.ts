import jwt from 'jsonwebtoken'
import config from '../config/config'

async function createAccessToken(id: string, email: string){
    const accessToken = jwt.sign({id, email}, config.accessTokenSecret, {expiresIn: '15m'})
    return accessToken
}

async function createRefreshToken(id: string, email: string){
    const refreshToken = jwt.sign({id, email}, config.refreshTokenSecret, {expiresIn: '2d'})
    return refreshToken
}

async function createTokens(id: string, email: string){
    const accessToken = jwt.sign({id, email}, config.accessTokenSecret, {expiresIn: '15m'})
    const refreshToken = jwt.sign({id, email}, config.refreshTokenSecret, {expiresIn: '2d'})
    return {accessToken, refreshToken}
}

async function validateAccessToken(accessToken: string){
    const payload = jwt.verify(accessToken, config.accessTokenSecret) 
    if (!payload) { 
        throw new Error
    }
    return payload 
}

async function validateRefreshToken (refreshToken: string){
    const payload = jwt.verify(refreshToken, config.refreshTokenSecret)
     if (!payload) { 
        throw new Error
    }
    return payload
}

export {createAccessToken, createRefreshToken, createTokens, validateAccessToken, validateRefreshToken}