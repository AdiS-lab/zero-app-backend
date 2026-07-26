import {validateAccessToken, validateRefreshToken} from '../utils/jwt.utils'
import type {Request, Response} from 'express'

export const authMiddleware = async(req: Request, res: Response, next: () => void) =>{
    const accessToken = req.headers.authorization?.split(" ")[1]
    if(!accessToken) return res.status(400).json({message: "No access token provided"})
    try{
        const {id} = await validateAccessToken(accessToken) as {id: string}
        req.id = id
        next()
    }catch(error){
        return res.status(401).json({message: "Invalid access token"})
    }
}