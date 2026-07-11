import {Request, Response} from 'express'

async function userController(req: Request,res: Response){
    // extend from base / insert functionality
    // make sure structure defined by interface/model
    console.log(req)
}

export default userController