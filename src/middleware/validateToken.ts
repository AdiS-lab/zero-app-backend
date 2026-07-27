import {validateAccessToken} from '../utils/jwt.utils'
import type {Request, Response} from 'express'

export const authMiddleware = async(req: Request, res: Response, next: () => void) =>{
    const accessToken = req.headers.authorization?.split(" ")[1]
    if(!accessToken) return res.status(400).json({message: "No access token provided"})
    try{
        const {id} = await validateAccessToken(accessToken) as {id: string}
        req.id = id
        next()
    }catch(error: any){
        return res.status(401).json({e: error.message, message: "Invalid access token"})
    }
}