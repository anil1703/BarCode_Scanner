import { userLoginService } from "../Services/index.js"

export async function userLoginController(req,res) {

    const data = req.body

    try{
        const fetching = await userLoginService(data)
        res.status(fetching.status).send(fetching.message)
    }
    catch(error){
        res.status(error.status).send(error.message)
    }
}