import express from 'express'
import { addproduct,get1prod,getprod} from '../controllers/product.controller.js'
const productroutes=express.Router()
productroutes.post('/addproduct',addproduct)
productroutes.get('/',getprod)
productroutes.get('/:id',get1prod)
export default productroutes
