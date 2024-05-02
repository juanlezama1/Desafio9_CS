import { Router } from "express"
import { userModel } from '../models/users.js'
import { createHash, comparePSW } from "../utils/bcrypt.js"
import passport from "passport"

const sessionsRouter = Router ()

// Ruta para cargar una sesión activa en caso de login exitoso.
// Primero se ejecuta una función middleware (passport.authenticate) y luego se ejecuta la función final que
// trabaja en base a lo que previamente procesó el middleware

sessionsRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user)
        {
            return res.status(401).send("Usuario o contraseña no válidos")
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send("Usuario logueado correctamente")
    }

    catch (error)

    {
        res.status(500).send("Error al loguear usuario")
    }
})

// Ruta para registrar un usuario.
sessionsRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user)
        {
            return res.status(401).send("Usuario ya existente en la aplicación")
        }

        console.log(req.user)
        res.status(200).send("Usuario creado correctamente")
    }

    catch (error)

    {
        res.status(500).send("Error al registrar usuario")
    }
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/register', async (req, res) => {
    
        res.status(200).render('templates/user_registration')
        console.log("Usuario por registrarse...")
})

// Ruta para registro de un usuario por GET (visual)
sessionsRouter.get('/login', async (req, res) => {

        res.status(200).render('templates/user_login')
        console.log("Usuario por loguearse...")
})

sessionsRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.status(200).send("Sesión finalizada con éxito!")
    }

    catch (error)

    {
        res.status(500).send("Error al finalizar sesión!")
        console.log("Error al finalizar la sesión del usuario")
    }
})

export default sessionsRouter