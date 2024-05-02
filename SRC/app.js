import express from 'express'
import mongoose from 'mongoose'
import __dirname from './path.js'
import { engine } from 'express-handlebars'
import indexRouter from '../SRC/routes/indexRouter.js'
import { productModel } from './models/products.js'
import { cartModel } from './models/carts.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { userModel } from './models/users.js'
import passport from 'passport'
import initializatePassport from './config/passport/passport.js'

const my_app = express ()
const PORT = 8080

// Conexión con DB
mongoose.connect("mongodb+srv://lezamaj:indexport.2011@cluster0.r9uoba0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Desafio6")
    .then(() => console.log("Conectado a la DB!"))
    .catch(error => console.log("Error al conectarse a la DB: ", error))

// Middlewares
my_app.use(express.json())
my_app.use(cookieParser("Clave Secreta"))
my_app.use(session({
    secret: 'ClaveSecreta',
    resave: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://lezamaj:indexport.2011@cluster0.r9uoba0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Desafio6",
        ttl: 2*60*60 // 2 Horas
    }),
    saveUninitialized: true
}))
initializatePassport()
my_app.use(passport.initialize())
my_app.use(passport.session())
 
// Rutas
my_app.use('/', indexRouter)

// Implementación de Handlebars (motor de plantillas)
my_app.engine('handlebars', engine())
my_app.set('view engine', 'handlebars')
my_app.set('views', __dirname + '/views')

// Levanto el server
const my_server = my_app.listen(PORT, () => {
    console.log(`Escuchando solicitudes en el puerto ${PORT} ...`)
})

// Aclaración: Ya dejé la DB cargada con 10 productos, 4 usuarios y 3 carritos de antemano
// Dejo comentado el código adjunto donde se cargaron los productos/carritos/usuarios para evitar que se carguen de nuevo

// 1) Código que carga la DB con los productos:

// const cargar_db = async () => {
//     await productModel.insertMany([
//         {
//             "title": "Semillas de girasol - Pipas",
//             "description": "Tostadas y saladas",
//             "price": 1000,
//             "thumbnail": "pipas.webp",
//             "stock": 70,
//             "category": "Meals",
//             "status": true
//         },
//         {
//             "title": "Gelatina Royal",
//             "description": "Sabor a Durazno",
//             "price": 400,
//             "thumbnail": "gelatina.jpg",
//             "stock": 11,
//             "category": "Meals",
//             "status": true
//         },
//         {
//             "title": "Mostachol Matarazzo",
//             "description": "Moldeado al bronce",
//             "price": 1300,
//             "thumbnail": "matarazzo.webp",
//             "stock": 6,
//             "category": "Meals",
//             "status": true
//         },
//         {
//             "title": "Azúcar",
//             "description": "Común tipo A",
//             "price": 800,
//             "thumbnail": "azucar.jpg",
//             "stock": 45,
//             "category": "Other",
//             "status": true
//         },
//         {
//             "title": "Vinagre",
//             "description": "De alcohol",
//             "price": 700,
//             "thumbnail": "vinagre.webp",
//             "stock": 18,
//             "category": "Other",
//             "status": true
//         },
//         {
//             "title": "Frutos Secos",
//             "description": "Maní, Pasas de Uva y Castañas",
//             "price": 1800,
//             "thumbnail": "frutos_secos.jpg",
//             "stock": 50,
//             "category": "Meals",
//             "status": true
//         },
//         {
//             "title": "Sal de mesa",
//             "description": "Baja en Sodio",
//             "price": 450,
//             "thumbnail": "sal.webp",
//             "stock": 25,
//             "category": "Other",
//             "status": false
//         },
//         {
//             "title": "Aceite de oliva",
//             "description": "Extra virgen",
//             "price": 800,
//             "thumbnail": "aceite.webp",
//             "stock": 17,
//             "category": "Other",
//             "status": true
//         },
//         {
//             "title": "Pechuga de pollo",
//             "description": "Sin hueso y sin piel",
//             "price": 2500,
//             "thumbnail": "pechuga.png",
//             "stock": 60,
//             "category": "Meals",
//             "status": true
//         },
//         {
//             "title": "Coca Cola - 500 ml",
//             "description": "Zero, sin azúcar",
//             "price": 900,
//             "thumbnail": "coca_zero.jpg",
//             "stock": 45,
//             "category": "Beverages",
//             "status": true
//         }
//     ])
// }

// cargar_db()
// .then(() => console.log("Cargada la DB con los productos!"))
// .catch(() => console.log("Error al cargar la DB con los productos!"))

// 2) Código que carga la DB con los carritos:

// const cargar_db2 = async () => {

//     const { ObjectId } = mongoose.Types
//     await cartModel.insertMany([
//         {
//             "products": [
//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74b",
//                     quantity: 3
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74d",
//                     quantity: 2
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf752",
//                     quantity: 1
//                 }
//             ]
//         },

//         {
//             "products": [
//                 {
//                     id_prod: "661efe77302b9a9cfe1bf751",
//                     quantity: 5
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf750",
//                     quantity: 1
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74f",
//                     quantity: 2
//                 }
//             ]
//         },

//         {
//             "products": [
//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74e",
//                     quantity: 6
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74c",
//                     quantity: 2
//                 },

//                 {
//                     id_prod: "661efe77302b9a9cfe1bf74a",
//                     quantity: 4
//                 }
//             ]
//         }
//     ])
// }

// cargar_db2()
// .then(() => console.log("Cargada la DB con los carritos!"))
// .catch(() => console.log("Error al cargar la DB con los carritos!"))

// 3) Código que carga la DB con los usuarios:

// const cargar_db3 = async () => {
//     await userModel.insertMany([
//         {
//             "first_name": "Juan Pablo",
//             "last_name": "Lezama",
//             "age": 31,
//             "email": "juanpablolezama@gmail.com",
//             "password": "coderhousecoderhouse",
//             "category": "Standard_User"
//         },
//         {
//             "first_name": "Darío Nahuel",
//             "last_name": "López",
//             "age": 27,
//             "email": "darionahuellopez@gmail.com",
//             "password": "passwordpassword",
//             "category": "Admin"
//         },
//         {
//             "first_name": "María Agustina",
//             "last_name": "García",
//             "age": 28,
//             "email": "mariaagustinagarcia@yahoo.com",
//             "password": "123123123",
//             "category": "Standard_User"
//         },
//         {
//             "first_name": "Mariana Nicole",
//             "last_name": "Álvarez",
//             "age": 41,
//             "email": "mariananicolealvarez@hotmail.com",
//             "password": "abc123def456",
//             "category": "Admin"
//         }
//     ])
// }

// cargar_db3()
// .then(() => console.log("Cargada la DB con los usuarios!"))
// .catch(() => console.log("Error al cargar la DB con los usuarios!"))