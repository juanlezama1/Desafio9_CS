import { Router } from "express"
import { cartModel } from "../models/carts.js"

const cartsRouter = Router ()

// LECTURA DE UN CARRITO ESPECÍFICO
cartsRouter.get('/:cid', async (req, res) => {
 
    console.log("Enviando carrito específico...")
    let cart_code = req.params.cid // Obtengo el código del carrito

    // Intento obtenerlo de la DB
    try {
        let my_cart = await cartModel.findById(cart_code).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Seleccionado', subtitle: 'Detalle de productos:', cart: my_cart.products}),
        console.log("Carrito específico enviado!")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"}),
        console.log("Carrito específico no existe!")
    }
})

// UPDATE DE UN CARRITO ESPECÍFICO
cartsRouter.put('/:cid', async (req, res) => {

    console.log("Actualizando carrito específico...")
    let cart_code = req.params.cid // Obtengo el código del carrito a actualizar
    let updated_cart = req.body // Obtengo los valores del carrito actualizado

    // Busco por ID, lo actualizo y devuelvo el carrito actualizado
    try {
        let my_cart = await cartModel.findByIdAndUpdate(cart_code, updated_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products}),
        console.log("Carrito específico actualizado!")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe"}),
        console.log("Carrito específico a actualizar no existe!")
    }
})

// UPDATE DE CANTIDAD DE PRODUCTOS EN UN CARRITO ESPECÍFICO
cartsRouter.put('/:cid/products/:pid', async (req, res) => {

    console.log("Actualizando cantidad de producto en carrito específico...")
    let cart_code = req.params.cid // Obtengo el código del carrito a modificar
    let product_code = req.params.pid // Obtengo el código del producto a actualizar cantidad
    let updated_quantity = req.body // Obtengo la cantidad actualizada de ejemplares de ese producto (Objeto JSON con clave 'newQuantity')

    // Busco por ID, actualizo el carrito con la cantidad correspondiente y devuelvo el carrito actualizado
    try {
        let my_cart = await cartModel.findById(cart_code).lean()

        my_cart.products.forEach(product => {
            product.id_prod == product_code && (product.quantity = updated_quantity.newQuantity)
        })

        my_cart = await cartModel.findByIdAndUpdate(cart_code, my_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products}),
        console.log("Carrito específico actualizado!")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe"}),
        console.log("Carrito específico a actualizar no existe!")
    }
})

// DELETE DE UN PRODUCTO ESPECÍFICO EN CARRITO
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {

    console.log("Eliminando producto específico del carrito...")

    let cart_code = req.params.cid // Obtengo el código del carrito donde eliminaré el producto
    let product_code = req.params.pid // Obtengo el código del producto a eliminar del carrito

    try {
        // Encuentro el carrito en cuestión
        let my_cart = await cartModel.findById(cart_code).lean()

        // Le saco el producto indicado
        let updated_cart = {
            products: my_cart.products.filter(product => {
                return product.id_prod != product_code
            })
        }

        // Actualizo el carrito en la DB
        my_cart = await cartModel.findByIdAndUpdate(cart_code, updated_cart, {new: 'true'}).populate('products.id_prod').lean()
        res.status(200).render('templates/home_cart_id', {title: 'Carrito Actualizado', subtitle: 'Detalle de productos:', cart: my_cart.products}),
        console.log("Producto específico eliminado del carrito!")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"}),
        console.log("El carrito indicado no existe!")
    }
})

// VACIADO DE UN CARRITO
cartsRouter.delete('/:cid/', async (req, res) => {

    console.log("Eliminando productos del carrito...")

    let cart_code = req.params.cid // Obtengo el código del carrito donde eliminaré los productos

    try {
        // Actualizo el carrito vaciando el array de productos
        await cartModel.findByIdAndUpdate(cart_code, {products: []}).lean()

        res.status(200).send('Carrito vaciado con éxito!')
        console.log("Eliminados los productos del carrito!")
    }

    catch (error)

    {
        res.status(400).render('templates/error', {error_description: "El carrito no existe!"}),
        console.log("El carrito indicado no existe!")
    }
})

export default cartsRouter