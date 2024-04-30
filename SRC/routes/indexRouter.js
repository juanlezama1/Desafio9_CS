import productsRouter from './productsRouter.js'
import cartsRouter from './cartsRouter.js'
import cookiesRouter from './cookiesRouter.js'
import sessionsRouter from './sessionsRouter.js'
import express from 'express'
import __dirname from '../path.js'

const indexRouter = express.Router ()

// Índice de rutas
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/carts', cartsRouter, express.static(__dirname + '/public'))
indexRouter.use('/cookies', cookiesRouter, express.static(__dirname + '/public'))
indexRouter.use('/sessions', sessionsRouter, express.static(__dirname + '/public'))

indexRouter.get('/', async (req, res) => {

    res.redirect('/sessions/login')
})

export default indexRouter