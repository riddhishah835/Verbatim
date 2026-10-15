import Product from "../models/Product.model.js";
import mongoose from "mongoose";
//product add

 export const addproduct=async(req,res)=>{
    const {name,description,price,category,image,stock}=req.body
    if (!name || !description || !price || !category || !image ||
        stock === undefined || stock === null || stock === '')
    {
        return res.status(400).json({message:"Missing fields"})

    }
    if (price<0)
    {
        return res.status(400).json({message:"Invalid Price"})

    }
    if (stock<0)
    {return res.status(400).json({message:"Invalid Stock"})

    }
      try {
        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to add product"
        });
    }
 }
//get all product 
export const getprod= async(req,res)=>{
    const{search,category}=req.query
    const filter={}

    try{
        if(search)
        {
            filter.name={$regex:search,$options:"i"}
        }
        if(category)
        {
            filter.category=category
        }
        const product=await Product.find(filter);
        if (product.length>0)
        return res.status(200).json({
            success:true,count:product.length,products:product
        })
        return res.status(404).json({message:"Products not found"})
    }
    catch(err)
    {
        res.status(500).json({message:"Internal server error "})
    }
}
 //get 1 product
 export const get1prod=async(req,res)=>{
 const id=(req.params.id)

 
 if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({message:"Invalid product id"})
 try {

        const found = await Product.findById(id);

        if (!found) {
            
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product Found",
            data: found
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server error"
        });

    }

 }
