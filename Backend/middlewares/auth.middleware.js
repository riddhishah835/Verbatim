import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'
const isauth=async (req,res,next)=>{
    const token=req.cookies?.token
    if (!token)
        return res.status(401).json({message:"Authentication required"})

    let decoded
    try {
        decoded=jwt.verify(token,process.env.jwt_secret)
    } catch {
        return res.status(401).json({message:"Invalid or expired token"})
    }

    try {
    const customerfound=await Customer.findById(decoded.userid)
    if(!customerfound)
        return res.status(401).json({message:"Customer not found"})
    req.customerfound=customerfound
    next()
    } catch(err) {
    console.error("Authentication lookup failed:",err)
    return res.status(500).json({message:"Internal server error "})
}
}
export default isauth