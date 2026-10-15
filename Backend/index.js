import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import productroutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app= express()
dotenv.config()


const port=8000


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/customers',customerRoutes)
app.use('/products',productroutes)
app.use('/wishlist',wishlistRoutes)
app.use('/cart',cartRoutes)
app.use('/orders',orderRoutes)



mongoose.connect(process.env.dbURL).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})

app.listen(port,()=>{
    console.log("server started")
})
