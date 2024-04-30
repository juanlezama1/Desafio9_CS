import {Schema, model} from "mongoose"

// Prototipo de un carrito en la DB
const cartSchema = new Schema ({
    products: [{
        id_prod: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'products'
        },

        quantity: {
            type: Number,
            required: true
        }
    }]}
)

// Exporto este prototipo en mi colección
export const cartModel = model ("carts", cartSchema)