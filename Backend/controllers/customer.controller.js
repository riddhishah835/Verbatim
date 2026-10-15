import Customer from "../models/customer.model.js";
import bcrypt from "bcryptjs"
import gentoken from "../utilities/gentoken.js";


const cookieOptions={
    httpOnly:true
}
export const Registercustomer= async(req,res)=>{
    const {fullname,email,password,phone}=req.body
    try{
        if (!fullname||!email||!password||!phone)
            return res.status(422).json({message:"All fields required"})

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({message:"Please enter a valid email"})

        if (!/^\d+$/.test(phone))
            return res.status(400).json({message:"Phone number must contain numbers only"})

        if (password.length<6)
            return res.status(400).json({message:"password must be atleast 6 characters long"})

        const emailexists=await Customer.findOne({email})
        if (emailexists)
            return res.status(409).json({message:"Email already exists"})

        const hashedPass=bcrypt.hashSync(password,10);
        const newuser=await Customer.create({
            fullname, email, password:hashedPass,phone,
        })

        const token = gentoken(newuser._id);
        res.cookie("token",token,cookieOptions)
        
        res.status(200).json({message:"Customer registered successfully ",customer:newuser})

    }
    catch{
        return res.status(500).json({message:"Internal server Error"})
    }
}//login user
 export const logincustomer=async (req,res)=>{
    try{
        const{email,password}=req.body
        if (!email)
            return res.status(401).json({message:"Email not found"})
        if (!password)
            return res.status(401).json({message:"Password not present"})
        const customerexists=await Customer.findOne({email})
        if (!customerexists)
            return res.status(404).json({message:"User not found"})
        const correctpass= await bcrypt.compare(password,customerexists.password)
        if (!correctpass)
        {
            return res.status(401).json({message:"Incorrect Password"})
        }
        const token= gentoken(customerexists._id)
            res.cookie("token",token,cookieOptions)
            res.status(200).json({message:"Login succesful",customer:customerexists})

    }
    catch{
        res.status(500).json({message:"Internal server error"})
    }
 }
 // get user
 export const getuser=(req,res)=>{
    res.status(200).json(req.customerfound)
 }
 //LOGOUT
 export const logout=(req,res)=>{
 res.clearCookie('token',cookieOptions)
 res.status(200).json({message:"Log out successful"})

 }
 