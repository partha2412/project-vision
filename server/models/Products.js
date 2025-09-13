import mongoose,{ Schema } from "mongoose";

const ProductsSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
        required: true,
    },
    stock:{
        type: Number,
        default: 0,
    },
    images:[
        {
            type: String,
            required:true,
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
})

const ProductModel = mongoose.model("Product",ProductsSchema);

export default ProductModel;