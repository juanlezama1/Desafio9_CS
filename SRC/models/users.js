import {Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2"

// Prototipo de un usuario en la DB

const userSchema = new Schema ({

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        enum: ['Standard_User', 'Admin'],
        default: 'Standard_User',
        required: true
    }
})

// Añado la extensión del pagination
userSchema.plugin(paginate)

// Exporto este prototipo en mi colección
export const userModel = model ("users", userSchema)