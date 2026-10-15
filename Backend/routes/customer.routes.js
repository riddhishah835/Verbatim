import express from "express"
import {  getuser, logincustomer, logout, Registercustomer } from "../controllers/customer.controller.js"
import isauth from "../middlewares/auth.middleware.js"
const customerRoutes=express.Router()
customerRoutes.post('/register',Registercustomer)
customerRoutes.post('/login',logincustomer)
customerRoutes.get('/me',isauth,getuser)
customerRoutes.post('/logout',logout)
export default customerRoutes