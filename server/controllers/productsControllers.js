import CategoryModel from "../models/Category.js";
import ProductModel from "../models/Products.js";

export async function addProducts(req, res) {
    const { name, description, price, stock, images, categoryName } = req.body;

    try {
        if (!name || !price || !images || !categoryName) {
            return res.status(400).json({ message: "Name, price and category are required" });
        }

        // find category OR create if not exists
        let category = await CategoryModel.findOne({ name: categoryName });
        if (!category) {
            category = await CategoryModel.create({ name: categoryName });
        }

        const product = await ProductModel.create({
            name,
            description,
            price,
            stock,
            images,
            category: category._id,
        });

        return res.status(201).json({ 
            message: "Product added successfully", 
            product 
        });
    } catch (error) {
        console.error("Error in addProducts:", error.message);
        return res.status(500).json({ message: "Backend error", error: error.message });
    }
}


export async function searchProducts(req, res){
    
}